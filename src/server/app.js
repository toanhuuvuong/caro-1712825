require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // cross-origin resource sharing

// --- Config DB connection 
const dbConfig = require('./config/db');
const connectMongo = require('connect-mongo');
const MongoStoreFactory = connectMongo(session);

// --- Config Passport
const passport = require('passport');
require('./config/passport')(passport);

// --- Require router 
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
// User routes
const updateProfileRouter = require('./routes/user/update-profile');
const changePasswordRouter = require('./routes/user/change-password');
// Admin routes
const adminUpdateProfileRouter = require('./routes/admin/update-profile');
const adminChangePasswordRouter = require('./routes/admin/change-password');

const app = express();

// --- App use
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL,
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	optionsSuccessStatus: 200 
}));

// cookie parser
app.use(cookieParser());

// express session
const oneDay = 24 * 60 * 60 * 1000;
const sessionOptions = {
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	store: new MongoStoreFactory({
		url: dbConfig.DB_URL_CONNECT
	}),
	cookie: { 
		secure: true,
		maxAge: oneDay, 
		expires: new Date(Date.now() + oneDay)
	}
};
app.use(session(sessionOptions));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// middleware
require('./middlewares/middlewares')(app);

// global variables
app.use(function(req, res, next) {
	next();
});

// --- URL
app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
// User URL
app.use('/update-profile', updateProfileRouter);
app.use('/change-password', changePasswordRouter);
// Admin URL
app.use('/admin/update-profile', adminUpdateProfileRouter);
app.use('/admin/change-password', adminChangePasswordRouter);

module.exports = app;
