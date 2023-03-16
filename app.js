const express = require('express');
const { createHmac } = require('crypto');
const AWS = require('aws-sdk');
const { CognitoIdentityProviderClient, SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');

config();

const app = express();
const port = process.env.PORT || 3456;
const userPool = new AWS.CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
  userPoolId: process.env.USER_POOL_ID, 
  clientId:  process.env.CLIENT_ID 
});

app.use(express.json());

app.get('/is-logged', (req, res) => {
  res.status(200).send('is logged');
});

app.post('/user', async (req, res, next) => {
  const newUser = req.body;
  const hasher = createHmac('sha256', process.env.SECRET_HASH);
  const now = new Date();

  hasher.update(`${newUser.phone}${process.env.CLIENT_ID}`);
  const secretHash = hasher.digest('base64');

  const params = {
    ClientId: process.env.CLIENT_ID,
    Password: 'SamplePassword123!',
    SecretHash: secretHash,
    Username: newUser.phone,
    UserAttributes: [
      { Name: 'name', Value: 'Prasad Jayashanka' },
      { Name: 'family_name', Value: 'jay' },
      { Name: 'gender', Value: 'male' },
      { Name: 'birthdate', Value: '1991-06-21' },
      { Name: 'address', Value: 'CMB' },
      { Name: 'email', Value: 'sampleEmail@gmail.com' },
      { Name: 'picture', Value: 'ttt'},
      { Name: 'updated_at', Value: Math.floor(now.getTime() / 1000).toString() }
    ],
  };

  try {
    const data = await userPool.send(new SignUpCommand(params));
    console.log('User signed up:', data.UserSub);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});