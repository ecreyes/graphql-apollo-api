const express = require('express');
const app = express();
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

// set environment variables
dotEnv.config();

// body parser middleware
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server listening on port: ${PORT}`);
});