var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

let Abhrajit={
  name:"Abhrajit Ghosh",
  bio: "I am a student of ualbany. I play soccer sometimes I can bike swim and longboard. I am studing computer science.",
  pic:"https://abhrabucket.s3.amazonaws.com/les-qul300x300.jpg"
}
let DiMaria={
  name:"DiMaria",
  bio: "I play soccer proffesionally on PSG and will play for Argentina this world cup.",
  pic: "https://abhrabucket.s3.amazonaws.com/download.jfif"
}
let Juliano={
  name: "Juliano",
  bio:"I play counter strike global offensive a esport proffesionally",
  pic: "https://abhrabucket.s3.amazonaws.com/QCaCXQV.jpg"
}

let wizards= [Abhrajit, DiMaria,Juliano]

app.get('/', (req, res, next) => {
  res.render(    'index'   ,    {  wizards: wizards  }     );
});


// *****************************************************************************
// db Operations
// *****************************************************************************
const { MongoClient } = require('mongodb');

const url = 'mongodb://mongo:27017/';
//const url = 'mongodb://myuser:mypassword@mongo:27017/'; 
//  GET THE HOSTNAME, username & password & the DB name from environment vars. 
// Example: console.log(process.env.NODE_ENV);

const dbName = 'magicWorld';
const client = new MongoClient(url);

app.get('/db', async function(req, res, next) {
  try {
    
    const wizardsCopy = JSON.parse(JSON.stringify(wizards));
    // Try removing this! Can you answer why a deep copy is required here? 
    // What happens if same wizards array is used?

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('wizards');
    
    const insertResult = await collection.insertMany(wizardsCopy);
  
    console.log('Inserted documents =>', insertResult);

    const findResult = await collection.find({}).toArray();
    res.send(findResult);

  } catch (error) {
    console.log(error);
    next(error)
  } finally {
    client.close()
  }
  
});

// *****************************************************************************
// *****************************************************************************


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
