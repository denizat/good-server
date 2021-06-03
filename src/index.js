const { folder, PORT } = require("./cli");
const root = folder;
const { mimeTypes, makeHTML } = require("./html");

const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

// Stolen from https://javascript.plainenglish.io/parsing-post-data-3-different-ways-in-node-js-e39d9d11ba8
const getBoundary = (req) => {
  let contentType = req.headers["content-type"];
  const contentTypeArray = contentType.split(";").map((item) => item.trim());
  const boundaryPrefix = "boundary=";
  let boundary = contentTypeArray.find((item) =>
    item.startsWith(boundaryPrefix)
  );
  if (!boundary) return null;
  boundary = boundary.slice(boundaryPrefix.length);
  if (boundary) boundary = boundary.trim();
  return boundary;
};

const getData = (data, boundary) => {
  let rawData = data;
  rawDataArr = rawData.split(boundary);
  // console.log(rawDataArr);
  let betterData = rawDataArr.slice(1, rawDataArr.length - 1);
  // console.log(betterData);
  lastIndex = betterData[0].lastIndexOf("\r\n");
  // console.log(lastIndex);
  betterData = betterData[0].slice(0, lastIndex);
  // console.log(betterData);
  realData = betterData.split("\r\n");
  // console.log(realData);
  realData = realData.splice(4, realData.length).join("\r\n");
  // console.log(realData);
  return realData;
};

const server = http.createServer((req, res) => {
  // Some files have spaces in their name so the url we get has to be fixed
  let url = req.url.replaceAll("%20", " ");

  /////////////////////////////////////////////////////////////////////////////////// --- DANGER ZONE ---
  // Handles file uploads (THIS IS BROKEN)
  if (req.method === "POST") {
    if (req.headers["content-type"] === "multipart/form-data") {
      // Use latin1 encoding to parse binary files correctly
      req.setEncoding("latin1");
    }

    let rawData = "";
    // Note, the reason its called a chunk is because only chunck of data is given at a time, this function is called a billion times
    req.on("data", (chunk) => {
      rawData += chunk;
    });
    // When we are done getting data
    req.on("end", () => {
      boundary = getBoundary(req);
      let result = {};
      console.log("RawData: ", rawData);
      console.log("Boundary: ", boundary);
      let realData = getData(rawData, boundary);
      console.log("REALDATA", realData);
      fs.writeFile("a.out", realData, "utf8", (err) => {
        if (err) {
          console.log(err);
        }
      });

      // console.log(rawDataArr[1].split("Content")[1]);
      // for (const item of rawDataArr) {
      //   console.log("An item:", item);
      // }
    });
  }
  /////////////////////////////////////////////////////////////////////////////////// --- DANGER ZONE ---

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
