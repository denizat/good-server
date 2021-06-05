/**
 * This gets your private ip address so you know what to open on different local computers.
 */
const { networkInterfaces } = require("os");
const fs = require("fs");
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
// console.log(names);
// console.log(results[names[1]]);

const { argv } = require("process");
let PORT = 8080;
const pFlagIndex = argv.findIndex((value) => value === "-p");
if (pFlagIndex !== -1) {
  PORT = argv[pFlagIndex + 1];
}
exports.PORT = PORT;

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

if (argv.find((value) => value === "-u")) {
  exports.upload = true;
} else {
  exports.upload = false;
}

// Handles which folder will be the root of server
let folder;
const lastArg = argv[argv.length - 1];
if (fs.existsSync(lastArg) && fs.lstatSync(lastArg).isDirectory()) {
  if (lastArg === ".") {
    folder = ".";
  } else {
    folder = lastArg;
  }
} else {
  folder = ".";
}
exports.folder = folder;
