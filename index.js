const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({extended:false}))
  .set('views', path.join(__dirname, 'views'))
  .get('/', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokidex');
      const results = {'results': (result) ? result.rows : null};
      res.render('home', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/tokidex/:id', async (req, res) =>{
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokidex WHERE id=' + req.params.id);
      const results = {'results': (result) ? result.rows : null};
      res.render('detail', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/edit/:id', async (req, res) =>{
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokidex WHERE id=' + req.params.id);
      const results = {'results': (result) ? result.rows : null};
      res.render('edit', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/edit/:id', async (req, res) => {
    try{
      const client = await pool.connect();
      var list = req.body;
      var name = list.name;
      var weight = list.weight;
      var height = list.height;
      var element1 = list.element1;
      var power1 = list.power1;
      var element2 = list.element2;
      var power2 = list.power2;
      var element3 = list.element3;
      var power3 = list.power3;
      var trainer = list.trainer;
      var total = parseFloat(power1) + parseFloat(power2) + parseFloat(power3);

      const result = await client.query("UPDATE tokidex SET " +
      "name=" + name +
      ",weight=" + weight +
      ",height=" + height +
      ",element1=" + element1 +
      ",power1=" + power1 +
      ",element2=" + element1 +
      ",power2=" + power1 +
      ",element3=" + element1 +
      ",power3=" + power1 +
      ",trainer=" + trainer +
      ",total=" + total +
       " WHERE id=" + list.id + ";");

      const results = {'results': (result) ? result.rows : null};
      res.render('edit', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/delete/:id', async (req, res) => {
    try{
      const client = await pool.connect();
      var deletion = await client.query('DELETE FROM tokidex WHERE id=' + req.params.id);
      const result = await client.query('SELECT * FROM tokidex');
      const results = {'results': (result) ? result.rows : null};
      res.render('home', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/create', (req, res) => res.render('create'))
  .get('/comparison', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokidex');
      const results = {'results': (result) ? result.rows : null};
      res.render('comparison', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/create', async (req, res) => {
    try{
      const client = await pool.connect();
      var list = req.body;
      var name = list.name;
      var weight = list.weight;
      var height = list.height;
      var element1 = list.element1;
      var power1 = list.power1;
      var element2 = list.element2;
      var power2 = list.power2;
      var element3 = list.element3;
      var power3 = list.power3;
      var trainer = list.trainer;
      var total = parseFloat(power1) + parseFloat(power2) + parseFloat(power3);

      const result = await client.query("INSERT INTO tokidex " +
      "(name, weight, height, element1, power1, element2, power2, element3, power3, trainer, total) VALUES ( '" +
      name + "', " +
      weight + ", " +
      height + ", '" +
      element1 + "', " +
      power1 + ", '" +
      element2 + "', " +
      power2 + ", '" +
      element3 + "', " +
      power3 + ", '" +
      trainer + "', " +
      total + ");" );

      res.render('create');
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/times', (req, res) => res.send(showTimes()))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM tokidex');
      const results = {'results': (result) ? result.rows : null};
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/data', (req, res) => {
    var getUserQuery = `SELECT * FROM tokidex`;
    console.log(getUserQuery);
    pool.query(getUserQuery, (error, result) => {
      if(error)
        res.end(error);
      var results = {'rows':result.rows};////////////////////////////////
      console.log(results);

    })
  })

  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}
