'use strict';

var express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    logger = require('services/loggerService');


var app = express();

app.disable('x-powered-by');

// request logger start
var logDirectory = 'log'; // ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

if (app.get('env') == 'development' || app.get('env') == 'localhost') {
    app.use(morgan('dev', {
        skip: function (req, res) { return res.statusCode < 400 }
    }));
} else {
    app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
}

// compress all requests
app.use(compression());

app.enable('strict routing');

var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict: app.get('strict routing')
});

// // Middlewares
// if (app.get('env') == 'development' || app.get('env') == 'localhost') {
//     app.use(express.static('.tmp')); // jshint ignore:line
//     app.use(express.static('src/public')); // jshint ignore:line
// } else {
//     var staticPath = path.join(__dirname, '..', 'dist');
//     app.set('staticPath', staticPath);
//     app.use(favicon(staticPath + '/favicon.ico', {
//         maxAge: 60 * 60 * 24 * 365 * 1000
//     }));
//     app.use(express.static(staticPath, {
//         maxAge: 60 * 60 * 24 * 365 * 1000,
//         setHeaders: function (res, path, stat) {
//             res.set('expires', Date.now() + 1000 * 60 * 60 * 24 * 365);
//         }
//     }));
// }



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Environment specific configs
//envConfig.setConfig(app.get('env'));

app.locals.environment = app.get('env'); //environment setting


app.use('*', function(req, res, next){
    logger.info('hi...... yoho....');
    res.send({
        message : 'Hi man !!'
    })
});


module.exports = app;
