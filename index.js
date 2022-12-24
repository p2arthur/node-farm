const http = require("http");
const url = require("url");
const fs = require("fs");

//Server

//Top level code once the code is loaded

//Creating a replace element function to replace the placeholders on the overview html with actual data
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

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
  console.log(req.url);

  const pathName = req.url;

  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join("");

    //Replacing the tempOutput with our cardsHtml
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathName === "/product") {
    res.end("<h1>Hello to product you mfer</h1>");
  }

  //API page
  else if (pathName === "/api") {
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
