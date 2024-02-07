const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
})

connection.connect((err: unknown) => {
    if(err){
        console.error('Error connecting to database', err)
        return
    }
    console.log('connected to the database')
})