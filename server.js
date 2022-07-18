import express from "express";
import { JobSource } from "./models/JobSource.js";
import { User } from "./models/Users.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// const user = {
//   id: 1,
//   username: "hans",
//   firstname: "Hans",
//   lastname: "Richter",
// };

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/bbc-job-manager-bcrypt";

mongoose.connect(MONGODB_URI, (err) => {
  if (err) console.log(err);
});

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 30445;

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

const decodeJwt = (token) => {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  let decodedData = JSON.parse(
    Buffer.from(base64, "base64").toString("binary")
  );
  return decodedData;
};

app.get("/", (req, res) => {
  res.send("<h1>Job Manager API</h1>");
});

app.post("/maintain-login", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const data = decodeJwt(req.token);
      res.json({
        user: data.user,
      });
    }
  });
});

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username === "hans" && password === "123") {
//     jwt.sign({ user }, "secretkey", { expiresIn: "50s" }, (err, token) => {
//       res.json({
//         user,
//         token,
//       });
//     });
//   } else {
//     res.sendStatus(403);
//   }
// });

//BCRYPT LOGIN

app.post("/login", async (req, res) => {
  const username = req.body.username;
  let password = req.body.password;
  const user = await User.findOne({ username });
  if (user === null) {
    res.status(403).send("User not found");
  } else {
    const passwordIsCorrect = await bcrypt.compare(password, user.hash);
    if (passwordIsCorrect) {
      const frontendUser = {
        username,
        firstName: user.firstName,
        lastName: user.lastName,
        accessGroups: user.accessGroups,
      };
      jwt.sign(
        { user: frontendUser },
        "secretkey",
        { expiresIn: "50s" },
        (err, token) => {
          res.json({
            user: frontendUser,
            token,
          });
        }
      );
    } else {
      res.status(403).send("bad password");
    }
  }
});

app.get("/job-sources", async (req, res) => {
  const jobSources = await JobSource.find();
  res.status(200).json(jobSources);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
