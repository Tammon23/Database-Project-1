// Backend: application services, accessible by URIs

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// [IKENNA START]
// Middleware for the authentication token
function authenticateToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return response.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(403).json({ error: "Invalid or expired token" });
    }

    console.log("JWT decode: " + decoded);
    request.user = decoded; // Add user info to request
    next();
  });
}

// Tries to register a new user
app.post("/register", (request, response) => {
  console.log("app: register a user.");
  const { username, firstname, lastname, dob, password } = request.body;

  console.log(request.body);
  const db = dbService.getDbServiceInstance();

  const result = db.registerNewUser(
    username,
    firstname,
    lastname,
    dob,
    password
  );

  result
    .then((data) => response.json({ success: true, data: data }))
    .catch((err) => {
      console.log(err);
      response
        .status(400)
        .json({ success: false, message: "Error occured during registraton" });
    });
});

// tries to log in a new user
app.post("/login", (request, response) => {
  console.log("app: log in user");
  console.log(request.body);

  const { username, password } = request.body;

  const db = dbService.getDbServiceInstance();
  const result = db.LogInUser(username, password);

  result
    .then((data) => {
      console.log("Login: ", data.success);
      if (data.success) {
        const token = jwt.sign(
          {
            username: username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        response.json({ success: true, token: token });
      } else {
        console.log("Login session failed:");
        response.json({ success: false });
      }
    })
    .catch((error) => console.log(error));
});

app.get("/search", authenticateToken, (request, response) => {
  const { method, firstname, lastname, userid } = request.query;

  console.log("app.js [search]:", request.query);

  const db = dbService.getDbServiceInstance();

  let result;

  switch (method) {
    case "firstname":
      result = db.searchByFirstname(firstname);
      break;

    case "lastname":
      result = db.searchByLastname(lastname);
      break;

    case "firstname-lastname":
      result = db.searchByFirstnameLastname(firstname, lastname);
      break;

    case "userid":
      result = db.searchByUserID(userid);
      break;

    default:
      return response
        .status(400)
        .json({ sucess: false, error: "Unknown search method" });
  }

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// [IKENNA END]
// create
app.post("/insert", authenticateToken, (request, response) => {
  console.log("app: insert a row.");
  // console.log(request.body);

  const { name } = request.body;
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name);

  // note that result is a promise
  result
    .then((data) => response.json({ data: data })) // return the newly added row to frontend, which will show it
    // .then(data => console.log({data: data})) // debug first before return by response
    .catch((err) => console.log(err));
});

// read
app.get("/getAll", authenticateToken, (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData(); // call a DB function

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/search/:name", authenticateToken, (request, response) => {
  // we can debug by URL

  const { name } = request.params;

  console.log(name);

  const db = dbService.getDbServiceInstance();

  let result;
  if (name === "all")
    // in case we want to search all
    result = db.getAllData();
  else result = db.searchByName(name); // call a DB function

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// update
app.patch("/update", authenticateToken, (request, response) => {
  console.log("app: update is called");
  //console.log(request.body);
  const { id, name } = request.body;
  console.log(id);
  console.log(name);
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(id, name);

  result
    .then((data) => response.json({ success: true }))
    .catch((err) => console.log(err));
});

// delete service
app.delete("/delete/:id", authenticateToken, (request, response) => {
  const { id } = request.params;
  console.log("delete");
  console.log(id);
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: true }))
    .catch((err) => console.log(err));
});

// debug function, will be deleted later
app.post("/debug", (request, response) => {
  // console.log(request.body);

  const { debug } = request.body;
  console.log(debug);

  return response.json({ success: true });
});

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get("/testdb", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.deleteById("14"); // call a DB function here, change it to the one you want

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// set up the web server listener
// if we use .env to configure

app.listen(process.env.PORT, () => {
  console.log("I am listening on the configured port " + process.env.PORT);
});
