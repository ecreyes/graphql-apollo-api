const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

// set environment variables
dotEnv.config();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

// apollo server
const typeDefs = gql`
    type Query {
        greetings: String
    }
`;

const resolvers = {};

// server
async function startApolloServer(typeDefs, resolvers) {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({app, path: '/graphql'});

    const PORT = process.env.PORT || 3000;
    await new Promise((resolve,reject)=> app.listen(PORT,resolve))
    console.log(`Server listening on port: ${PORT}`);
    console.log(`Graphql endpoint : ${apolloServer.graphqlPath}`);
}

startApolloServer(typeDefs,resolvers);