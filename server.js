const http = require("http");
const url = require("url");
const fs = require("fs");

http.createServer((req, res) => {
    let address = req.url;
    let q = url.parse(address, true);
    let filePath = "";

    if (q.pathname.includes("documentation")) {
      filePath = (__dirname + "/documentation.html");
    } else {
      filePath = "index.html";
    }


    fs.appendFile("log.txt", `URL: ${address}\n Timestamp: ${new Date()}`, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Added to log.")
      }
    })
  }).listen(8080);