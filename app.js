const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const inProduction = process.env.NODE_ENV === "production";
const app = express();

const bodyParser = require("body-parser");
const logger = require("morgan");
const csp = require("helmet-csp")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.disable("x-powered-by");
app.use(logger("dev"));
app.use(require("cookie-parser")());
app.use(require("connect-flash")());

if (!inProduction) {
	require("dotenv").load();
}

// csp policy https://csp-evaluator.withgoogle.com/
let allowedLinks = ["*.google-analytics.com", "*.google.com", "*.googleapis.com", "*.gstatic.com", "*.googletagmanager.com", "*.stripe.com", "*.facebook.net", "*.facebook.com"];
let defaultLinks = ["'self'", "*.stepgrab.com", "stepgrab.com", "localhost:*", "ws://localhost:*"];
let enableCSP = true;

if (enableCSP) {
	app.use(csp({
		// Specify directives as normal.
		directives: {
			defaultSrc: defaultLinks,
			scriptSrc: [...defaultLinks, ...allowedLinks],
			styleSrc: ["'unsafe-inline'", ...defaultLinks, ...allowedLinks],
			fontSrc: [...defaultLinks, ...allowedLinks],
			imgSrc: [...defaultLinks, ...allowedLinks],
			sandbox: ["allow-forms", "allow-scripts", "allow-same-origin", "allow-popups", "allow-modals"],
			reportUri: "/report-violation",
			objectSrc: ["'none'"],
			upgradeInsecureRequests: false,
			workerSrc: [...defaultLinks, ...allowedLinks, "blob"],
			frameSrc: [...defaultLinks, ...allowedLinks],
			connectSrc: [...defaultLinks, ...allowedLinks]
		},
		// This module will detect common mistakes in your directives and throw errors if it finds any. To disable this, enable "loose mode".
		loose: false,
		// Set to true if you only want browsers to report errors, not block them You may also set this to a function(req, res) in order to decide dynamically whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
		reportOnly: false,
		// Set to true if you want to blindly set all headers: Content-Security-Policy, X-WebKit-CSP, and X-Content-Security-Policy.
		setAllHeaders: false,
		// Set to true if you want to disable CSP on Android where it can be buggy.
		disableAndroid: false,
		// Set to false if you want to completely disable any user-agent sniffing.  // This may make the headers less compatible but it will be much faster.  // This defaults to `true`.
		browserSniff: false
	}));
}

app.use((req, res, next) => {
	res.setHeader("X-Content-Type-Options", "nosniff"); //prevent js execution accidentally by mistakenly nonjs resource as script
	res.setHeader("X-Frame-Options", "SAMEORIGIN"); //prevents clickjacking due to iframe
	next();
})

//xss middleware - escape script tags
app.use(require("./backend/controllers/services/xss"));

//postgres session
const models = require("./backend/db/models");
const session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
var sessionStore = new SequelizeStore({
	db: models.sequelize,
	checkExpirationInterval: 60 * 60 * 1000,
	expiration: 7 * 24 * 60 * 60 * 1000
});

let sessionObj = {
	store: sessionStore,
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false, //dont store session if nothing was added to it
	cookie: {}
};

if (inProduction) {
	app.set("trust proxy", 1); // trust first proxy
	sessionObj.cookie.secure = true; //send over ssl only
	sessionObj.cookie.httpOnly = true; //inaccessible by js
	sessionObj.cookie.sameSite = "lax"; //prevent CSRF
} else {
	app.disable("view cache");
}

app.use(session(sessionObj));

const favicon = require("serve-favicon");
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));

//authentication
// const passport = require("./backend/middlewares/auth");
// app.use(passport.initialize());
// app.use(passport.session());

//load Views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./backend/views"));

//auth middleware
const auth = require("./backend/controllers/services/auth");
app.use(auth.authMiddleware);
const customerAuth = require("./backend/controllers/services/txtVerification");
app.use(customerAuth.middleware);

//load controllers aka routes
const controllers = require("./backend/controllers");
app.use(controllers);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

//error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.error = {};
	if (!inProduction) {
		res.locals.message = err.message;
		res.locals.error = err;
	}

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

// const https = require("https");
// const fs = require("fs");
// const httpsOptions = {
// 	key: fs.readFileSync("./server.key"),
// 	cert: fs.readFileSync("./server.crt")
// };
// https.createServer(httpsOptions, app).listen(PORT, () => {
// 	console.log("server running at " + PORT)
// });

// load Models 
// force: true <- drop tables
models.sequelize.sync({ alter: true }).then(() => {
	app.listen(PORT, () => {
		console.log(`Server is up and running on port ${PORT}`);
	});
});
