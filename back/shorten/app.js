const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { body, validationResult, query } = require("express-validator");
const dotenv = require('dotenv');

dotenv.config();

const app = express()
const port = process.env._PORT2

const DB_ADMIN = process.env.DB_ADMIN;
const DB_PASSOWRD = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${DB_ADMIN}:${DB_PASSOWRD}@notescluster.jddk6by.mongodb.net/?retryWrites=true&w=majority&appName=NotesCluster`;

const expression = "(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?";
const regex = new RegExp(expression);

const mongodb = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function generateRandomBase62(length) 
{
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) 
      result += characters[ Math.floor(Math.random() * characters.length) ];

    return result;
}

app.use(express.json());

app.post('/api/shorten',
    [
        body('long_url').isString().notEmpty().trim(),
    ],
    async (req, res) => {
        //  POST body data validation
        const result = validationResult(req);
        if(!result.isEmpty())
            return res.status(404).json({message: "Invalid shortURL input"});
        
        try {
            //  URL pattern validation
            if( !req.body['long_url'].match(regex) )
                return res.status(404).json({message: "Invalud URL link"});
    
            //  Connect to DB
            await mongodb.connect();
            const db = await mongodb.db("ShotLi");
            const collection = db.collection("ShortURL");
            
            //  Generate random short URL
            let short_url = "";
            while(true)
            {
                short_url = generateRandomBase62(10);

                const result = await collection.findOne({short_url: short_url});
                if(result == null)
                    break;
            }
            
            //  Add shortURl to db
            const result = await collection.insertOne(
                {
                    long_url: req.body['long_url'],
                    short_url: short_url,
                    created_at: Date.now(),
                    used_count: 0
                }
            );
            
            //  return short_url

            console.log(`[+] Long URL: ${req.body['long_url']} -> Shorting URL: ${short_url}`);

            return res.status(200).json({short_url: short_url});
            
        } catch (error) {
            console.log(`[-] Long URL: ${req.body['long_url']}`);
            return res.status(400).send("Error happened");
        }
        finally{
            await mongodb.close();
        }
    }
)

app.listen(port, () => {
  console.log(`Get short url app listening on port ${port}`)
})
