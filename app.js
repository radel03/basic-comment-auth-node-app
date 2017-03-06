var express    = require("express"), 
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Topic      = require("./models/topic"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");

var commentRoutes = require("./routes/comments"),
topicRoutes = require("./routes/topics"),
indexRoutes = require("./routes/index");

mongoose.Promise = global.Promise;   //new issue solution at: http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise

//mongoose.connect("mongodb://localhost/argue_me");
mongoose.connect("mongodb://user1:password@ds119750.mlab.com:19750/argueme");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//passport config
app.use(require("express-session")({
    secret: "Life is a box of chocolate, you never know what you're going to get.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//export user log info (req.user)
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//routes here
app.use(indexRoutes);
app.use(topicRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("argue.me server started!");
});