const express = require('express')
// import express from 'express'
const app = express()



app.get('/', (req, res) => "Hello, world!")
app.get('/trung', (req, res) => res.send('Is the best!'))

app.get('/get_response', (req, res) => {
    // Do something

    res.json({
        name: 'trung',
    })
})

app.listen(3012, () => console.log('Example app listening on port 3000!'))