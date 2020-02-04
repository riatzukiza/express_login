let userService = require("./user.service.js");
let jwt = require("jsonwebtoken");

let sign = (data) => new Promise((resolve,reject) => jwt.sign(data,(err,token) => err ? reject(err) : resolve(token)));
let createAccessToken = (user) => sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    userId:user.id
});

module.exports = class {
    static async login(req,res) {
        res.send({
            token:await createAccessToken(await userService.login(
                req.body.email,
                req.body.password
            ))
        });

    }
    static async create(req,res) {
        res.send({
            token:await createAccessToken(await userService.create(
                req.body.email,
                req.body.username,
                req.body.firstName,
                req.body.lastName,
                req.body.password
            ))
        });
    }
}
