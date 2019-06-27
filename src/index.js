const express = require("express")
const compression = require('compression')
const app = express()

app.use(compression())
app.use(express.static('public'))

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});