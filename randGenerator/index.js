const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.get('/rand', (req, res) => {
  const randomNum = parseInt((Date.parse(new Date()) * Math.random()) % 1000, 10);
  res.send({randomNum});
});

app.listen(PORT, () => {
  console.log(`Generator running ${PORT}`);
});