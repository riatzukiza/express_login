let bodyParser = require("body-parser");
let jwt = require("express-jwt");

let app = require("express")();

let userRoutes = require("./user/user.routes.js");
let postRoutes = require("./post/post.routes.js");

let jwtRouter = jwt({secret:"secret"})
    .unless({path:["/api/v1/user/login",
                   "/api/v1/user/create"]});


app .use(bodyParser.json())
    .use(jwtRouter)
    .post("/api/v1/user/login",userRoutes.login)
    .post("/api/v1/user/create",userRoutes.create)

    .post("/api/v1/post/create",postRoutes.create)
    .get("/api/v1/post/list",postRoutes.list);

module.exports = app;
