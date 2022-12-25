const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./modules/replaceTemplate");

//Server

//Top level code once the code is loaded

//Creating a replace element function to replace the placeholders on the overview html with actual data

//Reading the templates when the file is first loaded
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

//Fetching the data once the page is first loaded
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//--------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname);
  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join("");

    //Replacing the tempOutput with our cardsHtml
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-type": "text/html" });
    let output = replaceTemplate(tempProduct, product);
    if (!product.organic) {
      output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    }

    res.end(output);
  }

  //API page
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  //404 page
  else {
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
