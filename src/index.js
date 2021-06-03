/**
 * This gets your private ip address so you know what to open on different local computers.
 */
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object
let names = [];
for (const name of Object.keys(nets)) {
  names.push(name);
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}
console.log(names);
console.log(results[names[1]]);

const { argv } = require("process");
let PORT = 8080;
const pFlagIndex = argv.findIndex((value) => value === "-p");
if (pFlagIndex !== -1) {
  PORT = argv[pFlagIndex + 1];
}

const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

// These handle how the file extensions should be displayed
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

// Handles which folder will be the root of server
let folder;
const lastArg = argv[argv.length - 1];
if (fs.existsSync(lastArg)) {
  if (lastArg === ".") {
    folder = ".";
  } else {
    folder = lastArg;
  }
} else {
  folder = ".";
}
const root = folder;

/**
 *
 * @param {string} dir The current directory
 * @returns {string} The previous directory
 */
const prevFolder = (dir) => {
  dir = dir.split("/");
  if (dir.length < 3) {
    return ".";
  }
  dir.pop();
  return dir.join("/");
};

/**
 *
 * @param {string} dir The current directory
 * @param {string[]} stringArr All of the folders/files in the directory
 * @returns {string} HTML for the current directory
 */
const makeHTML = (dir, stringArr) => {
  if (dir === "/") {
    dir = ".";
  }
  let html = `
  <h1>Index of ${dir}/</h1>

---
<form action="${dir}" method="post" enctype="multipart/form-data">
  <label for="file">Upload a file</label>
    <input type="file" id="file" name="da_file">
  <input type="submit">
</form>
---
            <form action="/" method="post">
                <input type="text" name="fname" /><br />
                <input type="number" name="age" /><br />
                <input type="file" name="photo" /><br />
                <button>Save</button>
            </form>




  <div><a href="${prevFolder(dir)}">..</a> =:= ${prevFolder(
    dir
  )} dir:::${dir} </div>`;
  stringArr.forEach((file) => {
    let link = dir + "/" + file;
    html += `<div><a href="${link}">${file}</a> =:= ${link} dir:::${dir} </div>`;
  });
  return html;
};

const server = http.createServer((req, res) => {
  // Some files have spaces in their name so the url we get has to be fixed
  let url = req.url.replaceAll("%20", " ");

  // Handles file uploads
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
      console.log(qs.decode(rawData));
    });
  }

  // Get stats on requested folder/file
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
});
server.listen(PORT);

// Opens url in browser if -o flag is given
let url = `http://${results[names[1]]}:${+PORT}/`;
console.log(`Server running at: ${url}`);

if (argv.find((value) => value === "-o")) {
  var start =
    process.platform == "darwin"
      ? "open"
      : process.platform == "win32"
      ? "start"
      : "xdg-open";
  require("child_process").exec(start + " " + url);
}
