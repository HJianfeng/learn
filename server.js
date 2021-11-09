const express = require('express')
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.resolve(__dirname, '/dist')
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
const port = 3000
app.post('/upload', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if(res.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return;
  }
  await handleFormData(req, res);
})
function handleFormData(req, res) {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if(err) {
      res.send(err);
      return
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    const chunkDir = `${UPLOAD_DIR}/${filename}`;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.renameSync(chunk.path, `${chunkDir}/${hash}`);
    res.end("received file chunk");
  })
}
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})