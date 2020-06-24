const express = require('express');
const app = express();

app.get('/', (req,res) => {
    res.send('<h1>My future shop</h1>');
})

app.listen(8080, ()=>{
    console.log("Shop is Up!");
})