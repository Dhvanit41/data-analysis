require('dotenv').config('../.env')

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  db:{
    DB_HOST:process.env.DB_HOST,
    DB_USER:process.env.DB_USER,
    DB_PASS:process.env.DB_PASS,
    DB_NAME:process.env.DB_NAME,
    dialect:'postgres',
    pool:{
      max:5,
      min:0,
      acquire:30000,
      idle:10000
    }
  },
  chart:{
    start:'2020-11-01',
    end:'2021-11-01'
  }
};