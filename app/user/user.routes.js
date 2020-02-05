let userService = require("./user.service.js");


module.exports = class {
    static async login(req,res) {
        try {
            let token = await userService.login(
                req.body.userName,
                req.body.password
            );
            res.send({token});
        } catch(err) {
            console.log(err);
            res.send({error:err.message});
        }

    }
    static async create(req,res) {
        try {
            let token = await userService.create(
                req.body.email,
                req.body.username,
                req.body.firstName,
                req.body.lastName,
                req.body.password
            );
            res.send({
                token
            });
        } catch(err) {
            console.log(err);
            res.send({error:err.message});
        }
    }
}
