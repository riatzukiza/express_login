let db = require("../db/db.service.js");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

let sign = (data) => {
    return new Promise((resolve,reject) => {
        jwt.sign(data,"secret",(err,token) => {
            err ? reject(err) : resolve(token)
        })
    })
};
let createAccessToken = (user) => {
    return sign({
        exp: Math.floor(Date.now() ) + (60 * 60),
        userId:user.id
    });
};

module.exports = class {
    static async login(userName,password) {
        let [user] = await db("users").where({userName});
        if(await bcrypt.compare(password,user.password)) {
            return createAccessToken(user);
        }
        throw Error ("Unauthorized");

    }
    static async create(
        email,
        userName,
        firstName,
        lastName,
        password
    ) {
        let user =  await db("users").insert({
            email,userName,firstName,lastName,
            password: await bcrypt.hash(password,10)
        });
        return createAccessToken(user);

    }
}
