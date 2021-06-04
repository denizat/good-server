function handleUpload() {
  const inputFile = document.getElementById("file");
  const file = inputFile.files[0];
  if (inputFile.files.length) {
    const reader = new FileReader();
    reader.onload = () => {
      let f = new Uint8Array(reader.result);
      console.log(f);

      let oReq = new XMLHttpRequest();
      oReq.onload = () => {
        console.log("sent");
      };
      if (window.location.pathname === "/") {
        oReq.open("POST", window.location.pathname + file.name, true);
      } else {
        oReq.open("POST", window.location.pathname + "/" + file.name, true);
      }

      oReq.send(f);
    };
    reader.readAsArrayBuffer(file);
  }
}
