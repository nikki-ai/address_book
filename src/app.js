'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const { v4: uuid } = require('uuid');

const app = express();

const morganOption = (NODE_ENV === 'production');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

const addys = [
  {
    id: 'ce20079c-2326-4f17-8ac4-f617bfd28b7f',
    firstName: 'Nikki',
    lastName: 'Dibartolomeo',
    address1: '1234 Cotton candy dr.',
    address2: '1234 Sesame Street Lane',
    city: 'Cd',
    state: 'Utopia',
    zip: '98765'
  },
];

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/address', (req, res) => {
  res.json(addys);
});

app.post('/address', (req, res) => {
  const { firstName, lastName, address1, address2=false, city, state, zip } = req.body;

  if(!firstName){
    return res.status(400).send('First name required');
  }

  if(!lastName){
    return res.status(400).send('Last name required');
  }

  if(!address1){
    return res.status(400).send('Address 1 required');
  }

  if(!city){
    return res.status(400).send('City required');
  }

  if(!state && state.length !== 2){
    return res.status(400).send('State is required and must be 2 characters long');
  }

  if(!zip && zip.length !== 5){
    return res.status(400).send('Zip is required and must be 5 digits');
  }

  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  addys.push(newAddress);

  res.send('Successful entry');
});

app.delete('/address/:addyId', (req, res) => {
  const { addyId } = req.params;

  const index = addys.findIndex(a => a.id === addyId);

  // make sure we actually find a user with that id
  if (index === -1) {
    return res
      .status(404)
      .send('Address not found');
  }

  addys.splice(index, 1);

  res.status(204).end();
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
