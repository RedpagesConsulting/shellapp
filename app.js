const express = require('express');
const app = express();
const oracledb = require('oracledb');

port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('index.ejs');
  });

app.post('/check', (req, res) =>{
    let email = req.body.Email;
    let password = req.body.Password;
    let database = req.body.Database;

    console.log (`${email}, ${password}, ${database}`)

    try {
      connection = oracledb.getConnection({
        user: "hr",
        password: password,
        connectString: "localhost:1521/xepdb1"
      });
  
      console.log('connected to database');
      // run query to get all employees
      result = connection.execute(`SELECT * FROM employees`);
  
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
           connection.close();
          console.log('close connection success');
        } catch (err) {
          console.error(err.message);
        }
      }
    }
});

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });

  