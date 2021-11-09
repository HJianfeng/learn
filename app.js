const http = require('http');
const path = require('path');
const fs = require('fs');
const multiparty = require('multiparty');

const UPLOAD_DIR = path.resolve(__dirname, '.', '')
const server = http.createServer();

const resolvePost = req => {
  return new Promise(resolve => {
    let chunk = '';
    req.on('data', data => {
      chunk = chunk + data.toString("utf-8");
    });
    req.on('end', () => {
      console.log(chunk)
      resolve(chunk);
    })
  })
}
const mergeFileChunk = async (filePath, filename) => {
  const chunkDir = `${UPLOAD_DIR}/${filename}`;
  const chunkPaths = fs.readdirSync(chunkDir);
  fs.writeFileSync(filePath);
  chunkPaths.forEach(chunkPath => {
    fs.appendFileSync(filePath, fs.readFileSync(`${chunkDir}/${chunkPath}`));
    fs.unlinkSync(`${chunkDir}/${chunkPath}`);
  })
  fs.rmdirSync(chunkDir);
}

server.on('request', async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if(res.method === 'OPTIONS') {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === "/") {
    await handleFormData(req, res);
  }
  if (req.url === "/merge") {
    await mergeChunk(req, res);
  }
})
async function mergeChunk(req, res) {
  const data = await resolvePost(req);
  // const { filename } = data;
  // console.log(data)
  // const filePath = `${UPLOAD_DIR}/${filename}`;
  // await mergeFileChunk(filePath, filename);
  res.end(JSON.stringify({
    code: 0
  }))
}
function handleFormData(req, res) {
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    console.log(err, fields, files);
    if(err) return;
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


server.listen(3000, () => console.log("监听 3000 端口"))