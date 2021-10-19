const http = require("http");
const url = require("url");
const fs = require("fs");

const tempOverview = fs
  .readFileSync(`${__dirname}/templates/template-overview.html`)
  .toString();
const tempCard = fs
  .readFileSync(`${__dirname}/templates/template-card.html`)
  .toString();
const tempProduct = fs
  .readFileSync(`${__dirname}/templates/template-product.html`)
  .toString();

// console.log(tempCard);

const mainData = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const mainDataObj = JSON.parse(mainData);

const replaceTemplate = (templateHTML, data) => {
  let output = templateHTML.replace(/{%PRODUCTNAME%}/g, data.productName);
  output = output.replace(/{%QUANTITY%}/g, data.quantity);
  output = output.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/{%FROM%}/g, data.from);
  output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
  output = output.replace(/{%PRICE%}/g, data.price);
  output = output.replace(/{%ORGANIC%}/g, data.organic);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);
  output = output.replace(/{%ID%}/g, data.id);
  output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const server = http.createServer((req, res) => {
  //remember req.url is something like: /product?id=2498 or anything user requested.
  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const { pathname: pathName } = requestURL;
  const id = requestURL.searchParams.get("id");

  //overview
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = mainDataObj
      .map((data) => replaceTemplate(tempCard, data))
      .join("");

    const outputOverview = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(outputOverview);
  } else if (pathName === "/product") {
    const output = replaceTemplate(tempProduct, mainDataObj[id]);

    res.writeHead(200, {
      "Content-type": "text/html",
    });

    res.end(output);
  } else {
    res.end("wrong request");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server Listenin starting at port 8000");
});
