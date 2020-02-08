const database = require("../config/database");

exports.getItems = function () {
  return database.execute("SELECT * FROM generator.item");
}

exports.getItemById = function (id) {
  return database.execute("SELECT * FROM generator.item WHERE id = ?", [id]);
};

exports.getItemsByType = function (type) {
  return database.execute("SELECT * FROM generator.item WHERE type = ?", [type]);
};

exports.saveItem = function (item) {
  return database.execute("INSERT INTO generator.item (type, description) VALUES(?, ?)", [item.type, item.description]);
}
exports.deleteItem = function (id) {
  return database.execute("DELETE FROM generator.item WHERE id = ?", [id]);
}
