const express = require('express')
const port = process.env.PORT || 8081

let cors = require('cors');
const dotenv = require('dotenv')
const app = express();

app.use(express.json())
app.use(cors());
dotenv.config();

var conn = require('./database.js');


  function isValid( req , res  , next ){
  
    if( req.body.caption === "" || req.body.url === "" ) 
        return res.status(400).end();

    return next();
        
  }
  
  app.get( '/adds' , (req , res ) => {
        
        conn.getConnection(
            function (err, client) {
                client.query('SELECT user_id, add_id , add_url , add_detail FROM add_table ORDER BY add_id DESC;', function(err, rows) {
                    // And done with the connection.
                    if(err){
                        console.log('Query Error');
                        return res.status(500).end();
                    }
                    res.status(200).json(rows);
                    client.release();
                });
        });
        
  });

  app.get( '/comments' , (req , res ) => {
        
    conn.getConnection(
        function (err, client) {
            client.query('SELECT user_id, add_id , add_comment , add_detail FROM comment_table ORDER BY add_id DESC;', function(err, rows) {
                // And done with the connection.
                if(err){
                    console.log('Query Error');
                    return res.status(500).end();
                }
                res.status(200).json(rows);
                client.release();
            });
    });
    
});


  app.post('/add' , isValid , ( req , res ) => {
    
    var unq_id = Date.now();
    //console.log(req.body);
    var data = { "user_id" : `${req.body.user_id}` , "add_detail" : `${req.body.add_detail}` , "add_url" : `${req.body.add_url}` , "add_id" : `${unq_id}` };
    // console.log(data);
    conn.getConnection(
      function (err, client) {
          client.query(`INSERT INTO add_data.add_table ( "user_id" , "add_id" , "add_detail" , "add_url" ) VALUES ( ${data.user_id} , ${data.add_id} , ${data.add_detail} , ${data.add_url} );`, function(err, rows) {
              if(err){
                  console.log('Query Error');
                  return res.status(500).end();
              }
              res.status(200).send(`${add_id}`);
              client.release();
          });
    });

    
  });
  
  app.put('/addComment' , (req , res) =>{
    
    var data = { "user_id" : `${req.body.user_id}` , "add_comment": `${req.body.comment}`, "add_id" : `${req.body.add_id}` };
    conn.getConnection(
      function (err, client) {
          client.query(`INSERT INTO comment_table (user_id, add_id, add_comment ) VALUES ( ${data.user_id} , ${data.add_id} , ${data.add_comment} );`, function(err, rows) {
              if(err){
                  console.log('Query Error');
                  return res.status(500).end();
              }
              res.status(200).send( `${data.user_id}`);
              client.release();
          });
    });
  });

  app.patch( '/add/:id' , (req , res ) => { 
      const add_id = parseInt(req.params.id);
      
      var data = { "user_id" : `${req.body.user_id}` , "add_detail" : `${req.body.add_detail}` , "add_url" : `${req.body.add_url}` , "add_id" : `${add_id}` };

      conn.getConnection(
        function (err, client) {
            client.query(`UPDATE add_table SET add_detail = ${data.add_detail} , add_url = ${data.add_url}  WHERE user_id = ${data.user_id} AND add_id = ${data.add_id};`, function(err, rows) {
                if(err){
                    console.log('Query Error');
                    return res.status(500).end();
                }
                res.status(201).send(`${add_id}`);
                client.release();
            });
      });

  });
  
  app.delete( '/add/:id' , (req , res) => { 
    
    var data = { "user_id" : `${req.body.user_id}` , "add_id" : `${req.params.id}` };
    
    conn.getConnection(
      function (err, client) {
          client.query(`DELETE FROM add_table WHERE user_id = ${data.user_id} AND add_id = ${data.add_id};`, function(err, rows) {
              if(err){
                  console.log('Query Error');
                  return res.status(500).end();
              }
              res.status(201).send(`${data.add_id}`);
              client.release();
          });
    });

  });

  app.all("*", (request, response) => {
      response.status(404);
      response.send("Invalid api!");
  });
  
  app.listen(port, () => {
      console.log(`app listening at http://localhost:${port}`)
  });