const { folder, PORT } = require("./cli");
const root = folder;
const { mimeTypes, makeHTML } = require("./html");

const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

const server = http.createServer((req, res) => {
  // Some files have spaces in their name so the url we get has to be fixed
  let url = req.url.replaceAll("%20", " ");

  if (req.method === "POST") {
    // let rawData = "";
    // let rawData = [];
    // let rawData = new Buffer();
    // let rawData = new Uint8Array();
    req.on("data", (chunk) => {
      fs.appendFile(root + url, chunk, (err) => {
        if (err) {
          console.log(err);
        }
      });
      // rawData += chunk;
      // rawData.concat(Buffer.from(chunk, "binary"));
      // rawData.push(chunk);
    });
    // When we are done getting data
    req.on("end", () => {
      // console.log(rawData.slice(0, 100));
      // rawData = Buffer.from(rawData);
      // console.log(rawData);
      // fs.writeFile(root + url, rawData, (err) => {
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    });
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
