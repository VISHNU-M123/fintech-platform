const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT;
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

app.use(express.json());

// Endpoint to fetch user data
app.get('/users', async (req, res) => {
    const query = `
    query {
        users {
            id
            name
            email
        }
    }`;

    try {
        const response = await axios.post(
            HASURA_GRAPHQL_ENDPOINT,
            { query },
            {
                headers: {
                    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
                },
            }
        );
        res.json(response.data.data.users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to create a new user
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const query = `
    mutation ($name: String!, $email: String!) {
        insert_users_one(object: {name: $name, email: $email}) {
            id
            name
            email
        }
    }`;

    try {
        const response = await axios.post(
            HASURA_GRAPHQL_ENDPOINT,
            { query, variables: { name, email } },
            {
                headers: {
                    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
                },
            }
        );
        res.json(response.data.data.insert_users_one);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
