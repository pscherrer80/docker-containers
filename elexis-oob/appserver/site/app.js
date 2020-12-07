/*****************************************
 * This file is part of elexis-oob       *
 * Copyright (c) 2019-2020 by G. Weirich *
 *****************************************/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const busboy = require('connect-busboy')
const session = require('express-session')
const memstore = require('memorystore')(session)
const app = express();
const winston = require('winston')
const crypto = require('crypto')
winston.level = "debug"
winston.add(new winston.transports.Console())
winston.info("Appserver running in mode " + process.env.NODE_ENV)
const serveIndex = require('serve-index')
const indexRouter = require('./routes/index');
const backupRouter = require('./routes/backup')
const manageRouter = require('./routes/manage')
const dbRouter = require('./routes/db')
const tmpdir = require('os').tmpdir()
var multipart = require('connect-multiparty');
const resumable = require("./utils/resumable-node")(tmpdir + "/resumable.tmp")
const { mysqlFromChunks } = require('./utils/loader')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(multipart());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: crypto.randomBytes(16).toString(),
  resave: false,
  saveUninitialized: false,
  store: new memstore({
    checkPeriod: 1800000
  })
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy({
  highWaterMark: 10 * 1024 * 1024, // Set 10 MiB buffer
}));


// static routes to repositories
app.use('/elexis-core', serveIndex('public/core-repository'))
app.use('/elexis-base', serveIndex('public/base-repository'))
app.use('/elexis-ungrad', serveIndex('public/ungrad-repository'))


// configure valid routes
app.use('/', indexRouter);
app.use("/backup", backupRouter)
app.use("/db", dbRouter)
app.use("/manage", manageRouter)

// routes for large file upload
// retrieve file id. invoke with /fileid?filename=my-file.jpg
app.get('/fileid', function (req, res) {
  if (!req.query.filename) {
    return res.status(500).end('query parameter missing');
  }
  // create md5 hash from filename
  res.end(
    crypto.createHash('md5')
      .update(req.query.filename)
      .digest('hex')
  );
});

// Handle uploads through Resumable.js
app.post('/upload', function (req, res) {

  resumable.post(req, function (status, filename, original_filename, identifier, total) {
    console.log('app-POST', status, original_filename, total);
    res.send(status);
    if (status === "done") {
      try {
        console.log("done")
        mysqlFromChunks(resumable.baseFilename(identifier), total).then(() => {
          console.log("upload finished")
          //res.render("success", { header: "SQL hochgeladen", body: "Die SQL Datei wurde hochgeladen und wird jetzt auf den Server übertragen." })
        }).catch(err => {
          //res.render("error", { error: err, message: "Beim Übertragen ist ein Fehler geschehen." })
          console.log("caught: " + err)
        })
      } catch (err) {
        // console.log(err)
        res.render("error", { error: err, message: "Fehler beim Hochladen" })
      }
    }

  });
});

// Handle status checks on chunks through Resumable.js
app.get('/upload', function (req, res) {
  resumable.get(req, function (status, filename, original_filename, identifier) {
    // console.log('GET', status);
    res.send((status == 'found' ? 200 : 404), status);
  });
});


// all other routes: forward 404 to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
