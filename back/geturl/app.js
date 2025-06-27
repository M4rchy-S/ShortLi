const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { body, validationResult, query } = require("express-validator");
const { createClient } = require("redis");
const dotenv = require('dotenv');


dotenv.config();

const app = express()
const port = process.env._PORT1

const DB_ADMIN = process.env.DB_ADMIN;
const DB_PASSOWRD = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${DB_ADMIN}:${DB_PASSOWRD}@notescluster.jddk6by.mongodb.net/?retryWrites=true&w=majority&appName=NotesCluster`;

const mongodb = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const redis_client = createClient();
redis_client.on('error', (err) => console.log('Redis Client Error', err));

app.get('/api/geturl', 
    [
        query('short_url').isString().notEmpty().trim(),
    ],  async (req, res) => {

        const result = validationResult(req);
        if(!result.isEmpty())
            return res.status(404).json({message: "Invalid short_url input"});

        try 
        {
            redis_client.connect();
            const redis_response = await redis_client.get(req.query['short_url']);

            //  Search in redis
            let long_url = "";

            if(redis_response)
            {
                long_url = redis_response;
            }
            //  OR Search in DB
            else
            {
                await mongodb.connect();
                const db = await mongodb.db("ShotLi");
                const collection = db.collection("ShortURL");

                const result = await collection.findOne({
                    short_url: req.query['short_url']
                });

                if(!result)
                    throw "Link not found";

                redis_client.set(req.query['short_url'], result['long_url']);
                

                long_url = result['long_url'];
            }
    
            //  Redirect to longURL

            console.log(`[+] Short URL: ${req.query['short_url']} -> Original URL: ${long_url}`);

            fetch(`http://localhost:3003/service/analytic?short_url=${req.query['short_url']}`);

            return res.redirect(302, long_url);
        } 
        catch (error) 
        {
            console.log(`[-] Short URL: ${req.query['short_url']}`);
            return res.status(404).json({message: "Error happened" });
        }
        finally
        {
            await mongodb.close();
            await redis_client.quit();
        }

    }
)


app.listen(port, () => {
  console.log(`Get Long URL app listening on port ${port}`)
})
