const express = require('express');
const app = express();
const boletoRoutes = require('./routes/boletoRoutes');

app.use(express.json());
app.use('/boleto', boletoRoutes);
// app.use('/', (_req,res) => {
//   res.send('Hello World!');
// })

module.exports = app;
