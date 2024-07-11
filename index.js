const express = require('express');
const app = express();

const PORT = 8088;

const urlRoute = require('./routes/url');
const { connectToMongoDb } = require('./connection');
const { handleRedirectUrl } = require('./controllers/url')

app.use(express.json());

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
    .then(()=> console.log('MongoDb connected!'))
    .catch((err)=> console.log('MongoDB Error: ', err));

app.use('/url', urlRoute);

app.get('/:shortId', handleRedirectUrl)

app.listen(PORT, console.log(`Server started at PORT: ${PORT}`));