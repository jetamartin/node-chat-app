const path = require('path');
const express = require('express');


const publicPath = path.join(__dirname, '../public');
const app = express();

// Setup for Heroku -- if env variable present use it otherwise use 3000
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));



app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};
