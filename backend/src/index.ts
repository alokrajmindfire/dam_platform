import express from 'express';
import connectDB from './db/index';
import dotenv from 'dotenv';
import { app } from './app';

dotenv.config({
  path: './.env',
});

app.use('/', () => {
  console.log('Started');
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!! ', err);
  });
