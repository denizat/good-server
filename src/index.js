const { folder, PORT } = require("./cli");
const root = folder;
const { mimeTypes, makeHTML } = require("./html");

const http = require("http");
const fs = require("fs");
const path = require("path");
// const qs = require("querystring");

/**
 *  THIS IS BROKEN BUT https://javascript.plainenglish.io/parsing-post-data-3-different-ways-in-node-js-e39d9d11ba8
 * MIGHT KNOW HOW TO DO IT PROPERLY
 *
 * @param {string} stringData
 * @returns
 */
const parseFilePost = (stringData) => {
  lines = stringData.split("\n");
  let fileName = lines[1].slice(
    lines[1].indexOf("filename") + 10,
    lines[1].lastIndexOf('"')
  );
  let body = lines.slice(4, lines.length - 3).join("\n");
  console.log(lines.length - 4, lines.length - 0);
  return { name: fileName, data: body };
};

const server = http.createServer((req, res) => {
  // Some files have spaces in their name so the url we get has to be fixed
  let url = req.url.replaceAll("%20", " ");

  // Handles file uploads (THIS IS BROKEN)
  if (req.method === "POST") {
    if (req.headers["content-type"] === "multipart/form-data") {
      // Use latin1 encoding to parse binary files correctly
      req.setEncoding("latin1");
    }

    let rawData = "";
    req.on("data", (chunk) => {
      rawData += chunk; //.toString(); // convert Buffer to string
      // fs.writeFile(root + url + )
    });
    req.on("end", () => {
      let data = parseFilePost(rawData);
      console.log(data.name);
      const stream = fs.createWriteStream(root + url + data.name);
      stream.write(data.data, "binary");
      stream.close();
      console.log(root + url + data.name);
      // fs.writeFile(root + url + data.name, data.data, (err) => {
      //   if (err) {
      //     console.log(err);
      //     return;
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
