
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully!");
        const res = await client.query('SELECT * FROM users');
        res.rows.forEach(r => console.log(r.email));
        await client.end();
    } catch (err) {
        console.error("Connection error:", err);
    }
}

run();
