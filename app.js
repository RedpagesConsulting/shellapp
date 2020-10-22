const express = require("express");
const session = require("express-session");
const app = express();
const oracledb = require("oracledb");

port = process.env.PORT || 3000;

//let sect = Math.random().toString(36).substr(2, 5);
app.use(session({ resave: true, secret: "123456", saveUninitialized: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("pages/index.ejs", { loginDetails: " " });
});

var sess;

app.post("/check", (req, res) => {

  let duser = req.body.Username;
  let pass = req.body.Password;
  //let db = req.body.Database;
  // db.toUpperCase();
  // let dbStr = `local/${db}`;
  let errS = null;

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  async function run() {
    let connection;

    try {
      connection = await oracledb.getConnection({
        user: duser,
        password: pass,
        connectString: "localhost/XEPDB1",
      });

      console.log("Log in successfull");
    } catch (err) {
      console.error(err);
      errS = err.toString();
      console.error(errS);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
      if (errS === null) {
        // Valid user
        res.render("pages/resetpassword.ejs");
      } else if (errS === "Error: ORA-28000: The account is locked.") {
        //Account locked
        res.render("pages/resetpassword.ejs");
      } else if (
        errS === "ERROR: ORA-01017: invalid username/password; logon denied" ||
        errS ===
          "Error: ORA-12154: TNS:could not resolve the connect identifier specified"
      ) {
        //Invalid login details
        res.render("pages/index.ejs", {
          loginDetails:
            "Wrong username or password has been supplied and password cannot be changed.",
        });
      } else if (errS === "ORA-28001: the password has expired") {
        //Account expired
        res.render("pages/resetpassword.ejs");
      } else {
        //Any other error
        res.render("pages/index.ejs", {
          loginDetails: "An error occured, unable to perform action.",
        });
      }
    }
  }

  run();
});

app.post("/fresh", (req, res) => {
  let fuser = req.body.Username;
  let fpass = req.body.Password;
  
  let arr = [];

  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  async function run() {
    let connection;

    try {
      connection = await oracledb.getConnection({
        user: "C##JOHN",
        password: "er456re3",
        connectString: "localhost/XEPDB1",
      });
  
      const result = await connection.execute(
        `BEGIN
         SysChangePassword(:pUserName, :pPassWord);
         END;`,
        {  // bind variables
          pUserName:   fuser,
          pPassWord: fpass,
        }
      );
  
     arr = result.rows;
     console.log(result.rows);

     res.render("pages/index.ejs", {
      loginDetails:
        "Password updates successfully.",
    });
  
    //  console.log(result.rows);
    //  if (arr[0].DEFAULT_TABLESPACE !== "USERS") {
    
    //         //malicious attempt
    //         res.render("pages/index.ejs", {
    //           loginDetails: "User account not allowed.",
    //         });
    
    //       }
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  run();

  

});

app.all("/attempt", function (req, res) {
  console.log("Attempting to connect user......");
  let username = sess.Username;
  let pass = sess.Password;
  let db = sess.Database;
  let dbStr = `localhost/${db}`;
  let errNum = null;

  console.log(pass);
  //Attempt login
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  async function run() {
    let connection;

   
  }

  run();

  console.log(errNum);
  if (errNum === 28000) {
    //Account is locked
    res.render("pages/resetpassword.js");
  } else if (errNum === 01017) {
    //Invalid login details
    res.render("pages/index.ejs", {
      loginDetails:
        "Wrong username or password has been supplied and password cannot be changed.",
    });
  } else {
    //Any other exception
    res.render("pages/index.ejs", {
      loginDetails: "Unable to carry out opereation, please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
