const http = require("http");
const url = require("url");
const fs = require("fs");
const slugify = require("slugify");

const replaceTemplate = require("./helper/replaceTemplate");
const tempOverview = fs
  .readFileSync(`${__dirname}/templates/template-overview.html`)
  .toString();
const tempCard = fs
  .readFileSync(`${__dirname}/templates/template-card.html`)
  .toString();
const tempProduct = fs
  .readFileSync(`${__dirname}/templates/template-product.html`)
  .toString();

const mainData = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const mainDataObj = JSON.parse(mainData);
// console.log(mainDataObj);

const server = http.createServer((req, res) => {
  //remember req.url is something like: /product?id=2498 or anything user requested.
  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const { pathname: pathName } = requestURL;
  const id = requestURL.searchParams.get("id");
  console.log(requestURL.searchParams);

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
    if (!id) res.end("please enter an ID number of the product.");
    let output = replaceTemplate(tempProduct, mainDataObj[id]);
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
