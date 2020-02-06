let postService = require("./post.service.js");
module.exports = class {
    static async create (req,res) {
        try {
            if(req.user && req.user.exp > Date.now()) {
                return res.send({
                    postId:await postService.create(
                        req.user.userId,
                        req.body.title,
                        req.body.content,
                        req.body.tags
                    )
                });
            }
            else {
                console.log("not authorized",req.user);
                res.sendStatus(401);
                res.end();
            }
        } catch(err) {
            res.send({error:err.message})
        }

    }
    static async list (req,res) {
        if(req.user && req.user.exp > Date.now()) {
            return res.send(await postService.list());
        }
    }
}
