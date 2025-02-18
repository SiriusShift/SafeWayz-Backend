const { Pool } = require("pg");
require('dotenv').config(); // Ensure your .env is properly set up

const Client = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this URL is set in your .env file
    ssl: {
        rejectUnauthorized: false, // This is needed for hosted services like Heroku
    },
});

Client.connect()
    .then(() => console.log("Connected to DB"))
    .catch(err => {
        console.error("Connection error", err);
        // Optionally, you can exit process if connection fails
        process.exit(1);
    });

module.exports = Client;
