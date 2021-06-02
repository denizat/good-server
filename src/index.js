const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 8080;
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".jpeg": "image/jpeg",
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
  ".pdf": "application/pdf",
};

let folder;
if (process.argv[2]) {
  if (process.argv[2] === ".") {
    folder = ".";
  } else {
    folder = process.argv[2];
  }
} else {
  folder = ".";
}

console.log(folder);
console.log(fs.readdirSync(path.resolve(folder)));

const root = folder;

const prevFolder = (dir) => {
  dir = dir.split("/");
  if (dir.length < 3) {
    return ".";
  }
  dir.pop();
  return dir.join("/");
};

let s = "/Archive/Documents";
console.log(s.split("/").join("/"));

const makeHTML = (dir, stringArr) => {
  if (dir === "/") {
    dir = ".";
  }
  let html = `<div><a href="${prevFolder(dir)}">..</a> =:= ${prevFolder(
    dir
  )} dir:::${dir} </div>`;
  stringArr.forEach((file) => {
    let link = dir + "/" + file;
    html += `<div><a href="${link}">${file}</a> =:= ${link} dir:::${dir} </div>`;
  });
  return html;
};

const server = http.createServer((req, res) => {
  let url = req.url.replaceAll("%20", " "); //.slice(1);
  console.log(url);

  fs.lstat(root + url, (err, stats) => {
    if (err) {
      console.log(err);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("sorry bro, error", "utf-8");
    } else if (stats.isDirectory()) {
      fs.readdir(folder + url, (err, files) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(makeHTML(url, files), "utf-8");
      });
    } else if (stats.isFile()) {
      fs.readFile(root + url, (err, file) => {
        let extname = String(path.extname(root + url)).toLowerCase();
        res.writeHead(200, {
          "Content-Type": mimeTypes[extname] || "text/plain",
        });
        res.end(file, "utf-8");
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("something went wrong", "utf-8");
    }
  });

  //   res.end(root + url, "utf-8");
});
server.listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
