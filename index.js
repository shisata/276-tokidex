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
  .get('/:id', async (req, res) =>{
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokimon WHERE id=7');
      const results = {'results': (result) ? result.rows : null};
      res.render('detail', results);
      client.release();
    } catch(err){
      console.error(err);
      res.send("Error " + err);
    }
  })

  .post('/create', async (req, res) => {
    try{
      const client = await pool.connect();
      // const result = await client.query('INSERT INTO ' +
      // 'tokidex (name, weight, height, element1, power1, element2, power2, element3, power3, trainer) ' +
      // 'VALUES ( ${req.param.name}, ${req.param.weight}, ${req.param.height}, ${req.param.element1}, ${req.param.power1}, ${req.param.element2}, ${req.param.power2}, ${req.param.element3}, ${req.param,power3}, ${req.param.trainer}, ${req.param.total});';
      const result = await client.query("SELECT * FROM tokidex");
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
