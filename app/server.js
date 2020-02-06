let bodyParser = require("body-parser");
let jwt = require("express-jwt");

let app = require("express")();

let userMiddleware = require("./user/user.middleware.js");
let postMiddleware = require("./post/post.middleware.js");

let jwtRouter = jwt({secret:"secret"})
    .unless({path:["/api/v1/user/login",
                   "/api/v1/user/create"]});


app .use(bodyParser.json())
    .use(jwtRouter)
    .use("/api/v1",userMiddleware)
    .use("/api/v1",postMiddleware);



module.exports = app;
