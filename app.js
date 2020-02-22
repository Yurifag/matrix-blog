const stylus = require("stylus");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const config = require("./config.json")[app.get("env")];
const http = require("http").Server(app);
http.listen(config.web.http.port, config.web.http.host);
if(config.web.https.enabled) {
    const https = require("https").Server({
        key: fs.readFileSync(config.web.https.certificate.key),
        cert: fs.readFileSync(config.web.https.certificate.cert)
    }, app);
    https.listen(config.web.https.port, config.web.host);
}

if(app.get("env") !== "production") {
    app.use(require("morgan")("dev"));
    app.locals.pretty = true;
}

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(stylus.middleware({src: __dirname + "/public", compile: (str, path) => {
        return stylus(str, {}).set("filename", path);
    }}));
app.use(bodyParser.urlencoded({extended: false}));

//redirect to https if enabled
app.use((req, res, next) => {
    if(!req.connection.encrypted && config.web.https.enabled) {
        res.writeHead(301, {"Location": "https://" + req.headers["host"] + req.url});
        res.end();
    }
    else {
        return next();
    }
});
//send HSTS header
app.use((req, res, next) => {
    if(config.web.https.enabled && config.web.https.hsts) res.header("Strict-Transport-Security", "max-age=31536000; includeSubdomains");
    return next();
});

// routes
let site = require("./controllers/site");
app.all("/", site.index);
app.all("/js/components/*", site.component);

// static content
app.use(express.static(__dirname + "/public"));
app.use("/preact", express.static(__dirname + "/node_modules/preact/dist/preact.module.js"));
app.use("/preact.js.map", express.static(__dirname + "/node_modules/preact/dist/preact.module.js.map"));

// handle 404
app.use((req, res) => {
    res.status(400);
    res.render("404.pug", {title: "404: File Not Found"});
});

// handle 500
app.use((error, req, res) => {
    res.status(500);
    res.render("500.pug", {title:"500: Internal Server Error", error: error});
});

module.exports = app;
