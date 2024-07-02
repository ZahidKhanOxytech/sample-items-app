const { getConnection } = require("../config/db");

exports.getItemsById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const [items] = await connection.execute(
      "SELECT * FROM items WHERE id = ?",
      [id]
    );

    await connection.end();

    res.status(200);
    res.json(items);
  } catch (err) {
    console.log("err", err);
    res.status(500);
    res.json({ message: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const connection = await getConnection();
    const [items] = await connection.execute("SELECT * FROM items");

    await connection.end();

    res.status(200);
    res.json(items);
  } catch (err) {
    console.log("err", err);
    res.status(500);
    res.json({ message: err.message });
  }
};

exports.addItem = async (req, res) => {
  const { item_name, rate } = req.body;
  try {
    const connection = await getConnection();
    const [existingItem] = await connection.execute(
      "SELECT * FROM items WHERE item_name = ?",
      [item_name]
    );

    if (existingItem.length > 0) {
      await connection.end();
      res.status(409);
      res.json({ message: "Item already exists!" });
      return;
    }

    await connection.execute(
      "INSERT INTO items (item_name, rate) VALUES (?, ?)",
      [item_name, rate]
    );

    const [newItem] = await connection.execute(
      "SELECT * FROM items WHERE id = LAST_INSERT_ID()"
    );

    await connection.end();

    res.status(201);
    res.json(newItem[0]);
  } catch (err) {
    console.log("err", err);
    res.status(500);
    res.json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { item_name, rate } = req.body;
  try {
    const connection = await getConnection();
    const [updatedItem] = await connection.execute(
      "UPDATE items SET item_name = ?, rate = ? WHERE id = ?",
      [item_name, rate, id]
    );

    if (updatedItem.affectedRows === 0) {
      await connection.end();
      res.status(404);
      res.json({ message: "Item not found" });
      return;
    }

    const [result] = await connection.execute(
      "SELECT * FROM items WHERE id = ?",
      [id]
    );

    await connection.end();

    res.status(200);
    res.json(result[0]);
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    await connection.execute("DELETE FROM items WHERE id = ?", [id]);

    await connection.end();

    res.status(200);
    res.json({ message: "Item removed successfully" });
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};
