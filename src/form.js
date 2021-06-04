function handleUpload() {
  const inputFile = document.getElementById("file");
  const file = inputFile.files[0];
  if (inputFile.files.length) {
    const reader = new FileReader();
    reader.onload = () => {
      let f = new Uint8Array(reader.result);
      let oReq = new XMLHttpRequest();
      console.log(window.location.pathname + "/" + file.name);
      if (window.location.pathname === "/") {
        oReq.open("POST", window.location.pathname + file.name, true);
      } else {
        oReq.open(
          "POST",
          window.location.pathname + "/ROOOOOOOR" + file.name + "COOR",
          true
        );
      }

      oReq.setRequestHeader("url", window.location.pathname + "/" + file.name);
      oReq.send(f);
    };
    reader.readAsArrayBuffer(file);
  }
}
