const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
require('dotenv/config');
const express = require('express');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3456;

// Set up AWS Cognito Identity Provider client
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.COGNITO_REGION,
  userPoolId: process.env.USER_POOL_ID,     
  clientId: process.env.CLIENT_ID 
});

const poolData = {    
  UserPoolId: process.env.USER_POOL_ID, 
  ClientId:  process.env.CLIENT_ID 
  }; 

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


app.use(express.json());
app.get('/is-logged', authenticate,(req,res,next) => {
  res.status(200).send('is logged')
})
// Add middleware for authentication to the POST /user endpoint
app.post('/user', (req, res, next) => {
  const newUser = req.body;

  // TODO: add code to create new user in your database

  res.status(201).json(newUser);
});


app.get('/', (req, res, next) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});