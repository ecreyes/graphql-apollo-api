const express = require('express');
const app = express();
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const {tasks,users} = require('./constants/index');

// set environment variables
dotEnv.config();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

// apollo server
const typeDefs = gql`
    type Query {
        greetings: [String],
        tasks: [Task!]
    }

    type User {
        id: ID!,
        name: String!,
        email: String!,
        tasks: [Task!]
    }

    type Task {
        id: ID!,
        name: String!,
        completed: Boolean!,
        user: User!
    }
`;

const resolvers = {
    Query: {
        greetings: ()=> ['hello world!'],
        tasks: () => tasks
    },
    Task: {
        user: (parent) => {
            const userId = parent.userId;
            return users.find(user => user.id === userId);
        }
    }
};

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