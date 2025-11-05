const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const router = require('./routes');
const session = require('express-session');
const errorHandler = require('./middlewares/errorHandler');
const chalk = require("chalk");
const { logHandler } = require('./middlewares/logMiddleware');

chalk.level = 3;

require('dotenv').config();

const raw = process.env.BACKEND_ALLOWED_ORIGINS;
const allowedOrigin = raw
  .split(',')
  // .map(item => item.trim())
  // .filter(item => item.length > 0);
// console.log(raw, allowedOrigin);


const app = express();
app.disable("x-powered-by");

const corsLogger = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer || 'no-origin';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (req.method === 'OPTIONS')
    console.log(chalk.red.bold(`[CORS MESSAGE] ${new Date().toISOString()} - ${req.method} ${req.path} from ${origin}`));

  if ((origin === 'no-origin' || !allowedOrigin.includes(origin)) && !req.path.endsWith('/xml/setup')) {
    console.log(chalk.red.bold(`[CORS MESSAGE] ${new Date().toISOString()} - ${req.method} - ${ip} - ${req.path} from ${origin} is BLOCKED`));
    return res.status(403).send('Forbidden origin!')
  }
  next();
};

app.use(corsLogger);

if (process.env.BUILD_ENV != "production") {
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization', 'Custom-Header', 'format', 'Filename'],
    exposedHeaders: ['Content-Disposition', 'filename'],
    credentials: false
  }));
} else {
  app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization', 'Custom-Header', 'format'],
    exposedHeaders: ['Content-Disposition', 'filename'],
  }));
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


logger.token('date', () => {
  const now = new Date();
  return now.toISOString();
});

app.use(logger('[:date] :method :url :status :response-time ms - content length :res[content-length] - :from - :content-type - BODY :req-body'));

const methodColor = (m) => {
  if (m === "POST") return "red";
  if (m === "GET") return "green";
  if (m === "OPTIONS") return "yellow";
  return "bgRed";
}

logger.token("method", (req, res) => {
  const method = req.method;
  const color = methodColor(method);

  return chalk[color](method.toString());
});

const statusColor = (s) => {
  if (s >= 500) return "red";
  if (s >= 400) return "yellow";
  if (s >= 300) return "cyan";
  if (s >= 200) return "green";
  return "bold";
}

logger.token("status", (req, res) => {
  const status = res.statusCode;
  const color = statusColor(status);

  return chalk[color](status.toString());
});

logger.token('req-body', (req) => chalk.grey(`${JSON.stringify(req.body, null, 2)}`));

logger.token('from', function (req) {
  if (req.headers['x-forwarded-for']) {
    return chalk.magenta(`${req.headers['x-forwarded-for']}`)
  } else {
    return chalk.magenta(`${req.socket.remoteAddress}`)
  }
});
logger.token('content-type', (req) => req.headers['content-type'] && chalk.green(`${req.headers['content-type']}`));


app.get('/', function (req, res, next) {
  console.log('Base platform backend is working!');

  res.render('index', { title: 'Express' });
});

app.use(session({
  secret: process.env.JWT_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    secure: true,
    maxAge: 86400000
  }
}));

app.use(logHandler);
app.use(router);

app.use(errorHandler)

module.exports = app;
