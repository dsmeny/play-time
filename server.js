const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const fetcher = async () => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts`
  );
  const data = await response.data;
  return data;
};

app.use("/api", async (req, res) => {
  const page = req.query.page;
  let LOWER_BOUND = page * 10;
  if (page === 1) LOWER_BOUND = 0 * 10;
  let UPPER_BOUND = LOWER_BOUND + 10;

  let data = await fetcher();
  data = data.slice(LOWER_BOUND, UPPER_BOUND);
  res.status(200).json({ message: "ok", data });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
