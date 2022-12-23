const http = require("http");
const url = require("url");
const fs = require("fs");

//Server

//Top level code to fetch the data once the code is loaded
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("<h1>Hello to overview you mfer</h1>");
  } else if (pathName === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("<h1>Hello to product you mfer</h1>");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello World!",
    });
    res.end("<h1>404 Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () =>
  console.log("Listening to requests on port 8000")
);
