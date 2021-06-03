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

exports.mimeTypes = mimeTypes;

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
  let link;
  let table = "";
  stringArr.forEach((file) => {
    link = dir + "/" + file;
    table += `<tr><td>Icon</td><td>Data</td><td></td><td><a href="${link}">${file}</a></td></tr>`;
  });
  let html = `
  <!doctype html>
  <html>
  <head>
    <title>Index of ${dir}</title>
    <style> body {background-color:grey;color:white;}</style>
  </head>
  <h1>Index of ${dir}/</h1>

    <form action="${dir}" method="post" enctype="multipart/form-data">
      <label for="file">Upload a file</label>
        <input type="file" id="file" name="da_file">
      <input type="submit">
    </form>

<table>
  <tr>
    <th>
      Icon
    </th>
    <th>
      Data
    </th>
    <th>
      File Size
    </th>
    <th>
      Link
    </th>
  </tr>
  ${
    prevFolder(dir) === "."
      ? `<tr><td>Need Icon</td><td>Data</td><td></td><td>${prevFolder(
          dir
        )}</td></tr>`
      : ""
  }

  ${table}
</table>
  </html>
  `;
  return html;
};

exports.makeHTML = makeHTML;
