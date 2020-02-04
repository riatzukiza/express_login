let bodyParser = require("body-parser");
let jwt = require("express-jwt");

let app = require("express")();

let userRoutes = require("./user/user.routes.js");
//let postRoutes = require("./posts/posts.routes.js");

let jwtRouter = jwt({secret:"secret"})
    .unless({path:["/api/v1/user/login",
                   "/api/v1/user/create"]});


app .use(bodyParser.json())
    .use(jwtRouter)
    .use("/api/v1/user/login",userRoutes.login)
    .use("/api/v1/user/create",userRoutes.create);
    //.use("/api/v1/posts/create",postRoutes.create);

module.exports = app;
