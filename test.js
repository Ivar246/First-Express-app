const fs = require("fs");
// let arr = [{ title: "ravi" }];
// arr = JSON.parse(arr);
// console.log(arr);
// console.log(JSON.stringify(arr));
fs.readFile("./data/products.json", "utf-8", (err, fdata) => {
  let parsed = JSON.parse(fdata);
  console.log(parsed);
  let stringi = JSON.stringify([1, 2, 3]);
  console.log(stringi);
});
