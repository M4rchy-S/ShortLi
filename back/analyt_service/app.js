const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const { body, validationResult, query } = require("express-validator");
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const corsOptions = {
    // origin: 'http://localhost:5173', // Allow requests from this specific origin
    origin: '*', // Allow requests from all origins (use with caution in production)
    // origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // Allow multiple specific origins
    // origin: /your-domain\.com$/, // Allow origins matching a regular expression
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow sending cookies/authorization headers
  };

const app = express()
const port = process.env._PORT3

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

app.use(cors(corsOptions));

const hashmap = new Map();

app.get('/service/analytic', 
    [
        query('short_url').isString().notEmpty().trim(),
    ],  async (req, res) => {

        const result = validationResult(req);
        if(!result.isEmpty())
            return res.status(404).json({message: "Invalid short_url input"});

        try {
            const url = req.query['short_url'];

            if(!hashmap.get(url))
                hashmap.set(url, 0);

            hashmap.set(url, hashmap.get(url) + 1);
            
            console.log(`Incrementing Short URL: ${url}`);
            return res.status(200).json({status: "Good"});
        } catch (error) {
            console.log("Error during hashmap add");
            return res.status(404).json({message: "Error acquired"});
        }


    }
)


async function setup()
{
    await mongodb.connect();
    const db = await mongodb.db("ShotLi");
    const collection = await db.collection("ShortURL");

    setInterval(
        async () => {
            
            try 
            {
                
    
                hashmap.forEach( async (value, key, map) => 
                    {
                        let res = await collection.findOne({
                            short_url: key
                        });
    
                        if(!res)
                            return;
    
                        const new_size = res.used_count + value;
    
                        res = await collection.updateOne({
                                short_url: key
                            },
                            {
                                $set: {
                                    used_count: new_size
                                }
                            }
                        );
    
                    } 
                )
            } 
            catch (error) 
            {
                console.log("[-] Error during updating DB acquired");
            }
            finally
            {
                hashmap.clear();
            }
        }, 
    20000);
    
}

process.on('SIGINT', async () => {
    console.log("Exiting application");
    await mongodb.close();
    process.exit();
});

app.listen(port, () => {
    setup();
    console.log(`Analytic service app listening on port ${port}`)
});


