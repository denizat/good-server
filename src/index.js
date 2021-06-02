const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8081;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".opus": "audio/ogg",
  ".m4a": "audio/mp4",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

let folder;
if (process.argv[2]) {
  folder = process.argv[2];
} else {
  folder = ".";
}

const server = http.createServer((req, res) => {
  let dir = folder + req.url.replaceAll("%20", " ");
  console.log(`request: ${dir}`);

  if (fs.existsSync(dir)) {
    fs.lstat(dir, (err, stats) => {
      if (stats.isDirectory()) {
        fs.readdir(dir, (err, files) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(files.toString(), "utf-8");
        });
      } else if (stats.isFile()) {
        let extname = String(path.extname(dir)).toLowerCase();
        res.writeHead(200, { "Content-Type": extname });
        fs.readFile(dir, (err, content) => {
          res.end(content, "utf-8");
        });
      }
    });
  }

  //   fs.readFile("./index.html", (err, content) => {
  //     if (err) {
  //       if (err.code == "ENOENT") {
  //         res.writeHead(404, { "Content-Type": "text/html" });
  //         res.end(content, "utf-8");
  //       } else {
  //         res.writeHead(500);
  //         res.end("Bruh it doesn't work, sorry" + err.code + " ..\n");
  //       }
  //     } else {
  //       res.writeHead(200, { "Content-Type": "text/html" });
  //       res.end(content, "utf-8");
  //     }
  //   });
});
server.listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
