const express = require('express')
var app = express;
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.get('/', (req, res) => res.sendfile('public/home.html'))
app.get('/times', (req, res) => res.send(showTimes()))
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM tokidex');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/users', (req,res) => {
  var getUsersQuery = `SELECT * FROM tokidex`;
  console.log(getUsersQuery);
  pool.query(getUsersQuery, (error, result) => {
    if (error)
      res.end(error);
    var results = {'rows': result.rows };
    console.log(results);
    res.render('pages/users', results)
    });
});

app.get('/data', (req, res) => {
  var getUserQuery = `SELECT * FROM tokidex`;
  console.log(getUserQuery);
  pool.query(getUserQuery, (error, result) => {
    if(error)
      res.end(error);
    var results = {'rows':result.rows};////////////////////////////////
    console.log(results);

  })
})

app.set('view engine', 'ejs')
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


/*
showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}*/
