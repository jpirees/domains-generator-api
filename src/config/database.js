const { createConnection } = require("mysql");

const client = new createConnection({
  user: "root",
  host: "localhost",
  database: "generator",
  port: 3306
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
})

exports.execute = function (query, values) {
  return new Promise(function (resolve, reject) {
    client.query(query, values, function (err, res) {
      (err) ? reject(err) : resolve(res);
    });
  });

};


