let app = require("express")();
let postRouter = require("./post.router.js")
module.exports = app
    .post("/post/create",postRouter.create)
    .get("/post/list",postRouter.list);
