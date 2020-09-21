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
var flightinfo = require('./routes/flightdetails');

var paxdetails = require('./routes/paxlist');

var sendNotification = require('./routes/sendNotification');
 var savepassengerid = require('./routes/savepassengerid');
var Sendsms = require('./routes/Sendsms');
var soslist = require('./routes/soslist')
var sosrequest = require('./routes/sosrequest');
var getsmspayload = require('./routes/getsmspayload');
var offerslist = require('./routes/getancillaryoffer');
var paymentmaster = require('./routes/paymentmaster');
var sessioncreate = require('./routes/createsession');

var parsebcbp = require('./routes/parsebcbp');
var assignStation = require('./routes/assignStation');

var addtopall = require('./routes/addtoPALL');
var sabercommand = require('./routes/sabercommand');

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
app.use('/flightinfo', flightinfo);
app.use('/paxdetails', paxdetails)
app.use('/test', getsample);
app.use('/notify', sendNotification)
app.use('/savepassengerid', savepassengerid);
app.use('/Sendsms', Sendsms);
app.use('/getsmspayload', getsmspayload);
app.use('/sosrequest', sosrequest);
app.use('/soslist', soslist);
app.use('/offer',offerslist);
app.use('/paymentmaster', paymentmaster);
app.use('/paymentsession', sessioncreate)
app.use('/parsebcbp', parsebcbp);
app.use('/assignStation', assignStation);
app.use('/addtopall', addtopall);
app.use('/sabercommand', sabercommand);

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
