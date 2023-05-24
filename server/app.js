const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const products = require('./routes/api/products');

connectDB();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET =
    "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const port = process.env.PORT || 8082;

app.use(bodyParser.json())
app.use(express.json({ extended: false }));

app.use('/api/products', products);

app.listen(port, () => console.log(`Server running on port ${port}`));

require('./userDetails');
const User = mongoose.model('user');

app.post("/register", async (req, res) => {
    const { firstname, lastname, email, password, admincode, userType } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.json({ error: "User Exists" });
        }
        await User.create({
            firstname,
            lastname,
            email,
            password: encryptedPassword,
            admincode,
            userType,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ status: "usernotfound", error: "Invalid username/password" });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "10h",
        });

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ status: "error", error: "error" });
        }
    }

    res.json({ status: "error", error: "Invalid password" });
});


app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        });
        if (user === "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }

        const useremail = user.email;
        User.findOne({ email: useremail })
            .then((data) => {
                res.send({ status: "ok", data: data });
            })
            .catch((error) => {
                res.send({ status: "error", data: error });
            });
    } catch (error) { }
});

app.get("/getAllUser", async (req, res) => {
    try {
        const allUser = await User.find({});
        res.send({ status: "ok", data: allUser });
    } catch (error) {
        console.log(error);
    }
});

app.post("/deleteUser", async (req, res) => {
    const { id } = req.body;
    try {
        const deluser = await User.deleteOne({ id: id });
        res.send({ status: "Ok", data: deluser });
    } catch (error) {
        console.log(error);
    }
});

app.post("/changeusertype", async (req, res) => {
    const { email, newValue } = req.body;
    try {
        const user = await User.updateOne({ email: email }, { userType: newValue });
        res.send({ status: "Ok", data: user });
    } catch (error) {
        console.log(error);
    }
});

require('./cart');
const Cart = mongoose.model('cart');

app.post("/addtocart", async (req, res) => {
  const { productId, name, price, quantity } = req.body;

  try {
    let cartEntry = await Cart.findOne({ productId });

    if (cartEntry) {
      // If a cart entry already exists, update the quantity by adding the new quantity
      cartEntry.quantity += parseInt(quantity);
      await cartEntry.save();
    } else {
      // Create a new cart entry
      cartEntry = await Cart.create({
        productId,
        name,
        price,
        quantity: parseInt(quantity),
      });
    }

    res.send({ success: true, data: cartEntry });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).send({ success: false, error: 'An error occurred while adding item to cart.' });
  }
});

app.get("/getcart", async (req, res) => {
  try {
    const cart = await Cart.find({});
    res.send({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send({ success: false, error: 'An error occurred while fetching cart.' });
  }
});

app.delete("/deletecart", async (req, res) => {
  const { productId } = req.body;
  try {
    const delcart = await Cart.deleteOne({ productId: productId });
    res.send({ success: true, data: delcart });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).send({ success: false, error: 'An error occurred while deleting cart item.' });
  }
});
