const { folder, PORT } = require("./cli");
const root = folder;
const { mimeTypes, makeHTML } = require("./html");

const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

const server = http.createServer((req, res) => {
  let url;
  if (req.headers.url) {
    url = req.headers.url;
  } else {
    url = req.url;
  }
  // Some files have spaces in their name so the url we get has to be fixed
  url = url.replaceAll("%20", " ");
  console.log(url);

  if (req.method === "POST") {
    let tmpUrl = root + url;
    req.on("data", (chunk) => {
      fs.appendFile(tmpUrl, chunk, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    // When we are done getting data
    // url = url.split("/").slice(0, -2).join("/");
  }

  // Get stats on requested folder/file so that we can handle it properly
  fs.lstat(root + url, (err, stats) => {
    if (err) {
      // console.log(err);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("sorry bro, error", "utf-8");
    } else if (stats.isDirectory()) {
      fs.readdir(folder + url, (err, files) => {
        if (err) {
          console.log(err);
        }
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
      // res.writeHead(200, { "Content-Type": "text/html" });
      console.log(err);
      console.log(stats);
      // res.end("something went wrong", "utf-8");

      fs.readdir(folder + url, (err, files) => {
        if (err) {
          console.log(err);
        }
        console.log(stats.isSymbolicLink());
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(makeHTML(url, files), "utf-8");
      });
    }
  });
});
server.listen(PORT);
