require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const { mergepdfs } = require("./merge");

const upload = multer({ dest: "uploads/" });
app.use("/static", express.static("public"));

const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post("/merge", upload.array("pdfs", 2), async (req, res, next) => {
  console.log(req.files);

  if (!req.files || req.files.length < 2) {
    return res.status(400).send("Please upload at least two PDF files.");
  }

  let d = await mergepdfs(
    path.join(__dirname, req.files[0].path),
    path.join(__dirname, req.files[1].path)
  );
  res.redirect(`${BASE_URL}/static/${d}.pdf`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
