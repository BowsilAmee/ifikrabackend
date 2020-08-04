var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http')

var getflights = require('./routes/flights');
var loginagent = require('./routes/login');
var agenttoken = require('./routes/token');
var getsample = require('./routes/getsample');

//  var flightdetails = require('./routes/getflightdetails');
var app = express();

app.set('port', process.env.PORT || 3030)
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');

//app.use('/authenticate', authenticate);

app.use('/flights', getflights);
app.use('/login', loginagent);
app.use('/token', agenttoken);

app.use('/test', getsample);

//app.use('/flightdetails', flightdetails);

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
  console.log(err);
});

var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})
module.exports = app;
