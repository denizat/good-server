const { folder, PORT } = require("./cli");
const root = folder;
const { mimeTypes, makeHTML } = require("./html");

const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let url;
  if (req.headers.url) {
    url = req.headers.url;
  } else {
    url = req.url;
  }
  // Some files have spaces in their name so the url we get has to be fixed
  url = url.replaceAll("%20", " ");

  if (req.method === "POST") {
    let tmpUrl = root + url;
    let file = "";
    req.on("data", (chunk) => {
      file += chunk;
    });
    req.on("end", () => {
      // file = Buffer.from(file.split("base64,")[1], "base64");
      file = file.split("base64,")[1];
      fs.writeFileSync(tmpUrl, file, "base64");
    });
    // When we are done getting data
    // url = url.split("/").slice(0, -2).join("/");
  }

  // Get stats on requested folder/file so that we can handle it properly
  fs.lstat(root + url, (err, stats) => {
    if (err) {
      console.log(err);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end("sorry bro, error", "utf-8");
    } else if (stats.isDirectory()) {
      fs.readdir(root + url, (err, files) => {
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
    } else if (stats.isSymbolicLink()) {
      res.writeHead(418, { "Content-Type": "text/html" });
      res.end("Sorry bro, we cant handle symbolic links for now", "utf-8");
    } else {
      console.log(stats);

      res.writeHead(418, { "Content-Type": "text/html" });
      res.end("Sorry bro, we cant handle symbolic links for now", "utf-8");
    }
  });
});
server.listen(PORT);
