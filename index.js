// Importing necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Creating an instance of express
const app = express();
dotenv.config();

// Define a port number
const PORT = process.env.PORT || 1000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  mobile: String
});

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/pages/index.html"); // Send 'Hello, World!' for requests to the root URL
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, gender, mobile } = req.body;
    console.log(req.body); // Log the received form data for debugging

    const existUser = await Registration.findOne({ email: email });
    if (!existUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
        gender,
        mobile
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
