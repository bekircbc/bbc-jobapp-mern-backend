# Connection between MongoDB and server.js

- models/JobSource.js

        import mongoose from "mongoose";

        const jobSourceSchema = new mongoose.Schema({
         name: String,
          url: String,
        });

        export const JobSource = mongoose.model("job-source", jobSourceSchema);

- server.js

        const MONGODB_URI222 = "mongodb://localhost/bbc-job-manager";

        mongoose.connect(MONGODB_URI222, (err) => {
         if (err) {
         console.log({
        error: "Cannot connect to MongoDB database.",
          err: `"${err}"`,
         });
          }
        });

        app.get("/job-sources-local", async (req, res) => {
        const jobSources = await JobSource.find();
        res.status(200).json({ message: "fetching data from local", jobSources });
        });

# .env

        MONGODB_URI=mongodb+srv://<databasename>:<passwords>@cluster.aaaa.mongodb.net>@cluster.aaaa.mongodb.net/<databasename>

# JWT Authentication

        const user = {
         id: 1,
          userName: "hans",
          firstName: "Hans",
         lastName: "Richter",
        };

        app.use(express.json());

        app.post("/login", (req, res) => {
         const username = req.body.username;
         const password = req.body.password;
         if (username === "hans" && password === "123") {
          res.json({
             user,
          });
         } else {
         res.sendStatus(500);
         }
        });

# maintain login

                onst verifyToken = (req, res, next) => {
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

- in postmann headers.. authorization ... value = Bearer + token ...

# bcrypt

- hash = salt + password (bcrypt gives different hash in each login)

- you can add easy a secret key... random secret key. an array, random zahl and odd or even beginnig or end of the password..

- but salt and pepper, etc. can be best solution..

        bcrypt.compare(secret+password. datbaseHash)

- generating hash -- generate hash and addd hashes to users.json

        import bcrypt from "bcrypt";

        const createHash = async (password) => {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash("password", salt);
        return hash;
        };

        const passwords = ["anonymous123", "edward123", "jason123", "richter123"];

        passwords.forEach((password) => {
        (async () => {
        const hash = await createHash(password);
        console.log(`${password} => ${hash}`);
        })();
        });
