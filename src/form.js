function handleUpload() {
  const inputFile = document.getElementById("file");
  const file = inputFile.files[0];
  if (inputFile.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      //   document.getElementById("test").innerHTML = e.target.result;
      //   console.log(e.target.result);

      let oReq = new XMLHttpRequest();
      oReq.onload = () => {
        console.log("sent");
      };
      if (window.location.pathname === "/") {
        oReq.open("POST", window.location.pathname + file.name, true);
      } else {
        oReq.open("POST", window.location.pathname + "/" + file.name, true);
      }

      let blob = new Blob([file.name, "|BEGIN_FILE|", e.target.result], {
        type: "text/plain",
      });
      oReq.send(blob);
    };
    // console.log(window.location.pathname + "/" + file.name);
    reader.readAsText(file);
    // console.log(file.name);
  }
}
