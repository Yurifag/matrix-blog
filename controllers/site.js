module.exports.index = (req, res) => {
    res.render("layout", {
        component: "index"
    });
};

module.exports.component = (req, res, next) => {
    if(req.url.slice(-3) === ".js") {
        next();
    }
    else {
        res.redirect(req.url + ".js");
    }
};
