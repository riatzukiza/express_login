let app = require("express")();
let userRouter = require("./user.router.js");

module.exports = app
    .post("/user/login",userRouter.login)
    .post("/user/create",userRouter.create);
