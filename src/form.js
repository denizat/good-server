function handleUpload() {
  const inputFile = document.getElementById("file");
  const file = inputFile.files[0];
  if (inputFile.files.length) {
    const reader = new FileReader();
    reader.onload = () => {
      // let f = new Uint8Array(reader.result);
      // use this?https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js
      let f = reader.result;
      let oReq = new XMLHttpRequest();
      console.log(window.location.pathname + "/" + file.name);
      if (window.location.pathname === "/") {
        oReq.open("POST", window.location.pathname + file.name, true);
      } else {
        oReq.open(
          "POST",
          window.location.pathname + "/" + file.name + "",
          true
        );
      }

      oReq.setRequestHeader("url", window.location.pathname + "/" + file.name);
      oReq.send(f);
    };
    reader.readAsDataURL(file);
  }
}
