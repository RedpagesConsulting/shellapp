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

    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    
    async function run() {
    
      let connection;
    
      try {
        connection = await oracledb.getConnection( {
          user          : "Benjamin",
          password      : "Welcome@1234",
          connectString : "rmar_high"
        });
    
        const result = await connection.execute(
          `SELECT manager_id, department_id, department_name
           FROM departments
           WHERE manager_id = :id`,
          [103],  // bind value for :id
        );
        console.log(result.rows);
    
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

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });

  