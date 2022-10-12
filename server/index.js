/**
 * HOW TO START DATABASE SERVER
 * ---------------------------
 * Make sure you have mysql workbench installed
 * once installed create a database
 * create a table called inventory
 * create id with datatype INT with PK, NN, and AI
 * create name with datatype TEXT with NN
 * create description with datatype TEXT with NN
 * create stock with datatype INT with NN
 * create location with datatype TEXT with NN
 * Once that table is create it should work with this file
 * To start the server, make sure you are in the server directory
 * then type node index.js to run the server
 * if successfull a message will appear on the terminal saying server is running
 * If you make changes to this file you will have to restart the server to see changes
 */
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());

//DB connection
const db = mysql.createConnection({
    user:'root', //username from mysql 
    host: 'localhost',
    password: '', //password for mysql
    database: '', //name of the database you created
});

//Adds items to database after user clicks on the Add Item button
app.post('/create', (req, res) =>{
    const name = req.body.name;
    const description = req.body.desc;
    const stock = req.body.stock;
    const location = req.body.location;

    //replace inventory with the name of the table that you created
    db.query("INSERT INTO inventory (name, description, stock, location) VALUES (?,?,?,?)", 
    [name, description, stock, location], 
    (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send("Values inserted");
        }
    });

});

//get items from the database
app.get('/inventory', (req, res) =>{
    //replace inventory with name of table you created
    db.query("SELECT * FROM inventory", (err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

//update database (still needs work)
app.put('/update', (req,res) =>{
    const id = req.body.id;
    // const name = req.body.name;
    // const description = req.body.description;
    // const location = req.body.location;
    const stock = req.body.stock;
    
    db.query('UPDATE inventory SET stock = COALESCE(NULLIF(?, ""), stock) WHERE id = ?', [stock, id], (err, result) =>{
        if(err){
            console.log(err);
        } else {
            res.send(result);
            console.log(req.body);
        }
    })
});

//deletes item from database
app.delete('/delete/:id',(req, res)=>{
    const id = req.params.id;
    db.query("DELETE FROM inventory WHERE id = ?", id, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

//check to see if server is running
app.listen(3001, ()=>{
    console.log("Yay, your server is running on port 3001");
});
