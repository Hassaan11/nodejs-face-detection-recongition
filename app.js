const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express()

const passportController = require("./controllers/passport.controller");
const faceController = require("./controllers/face.controller");

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '15MB' }))
app.use(express.json());

app.use(bodyParser.json());

app.use("/api/passport", passportController);
app.use("/api/face", faceController);

app.get('/', async (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log(`Listening on port ${3000}`)
})