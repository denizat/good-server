const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8081;

let folder;
if (process.argv[2]) {
  folder = process.argv[2];
} else {
  folder = ".";
}

const server = http.createServer((req, res) => {
  if (req.url !== "/favicon.ico") {
    let dir = folder + req.url;
    console.log(`request: ${dir}`);

    fs.readdir(dir, (err, files) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(files.toString(), "utf-8");
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
