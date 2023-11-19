const express = require('express');

const app = express(); 


app.get('/', (req, res) => {
    res.send('hola');
})

app.get('/us', (req, res) => {
    res.json('fuasasnco');
  });

const userRouter = require('./routes/users');
const reservationRouter = require('./routes/reservations');

app.use('/users', userRouter);
app.use('/reservation', reservationRouter);

app.listen(3000);