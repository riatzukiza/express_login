let db = require("../db/db.service.js");

let bcrypt = require("bcrypt");

module.exports = class {
    static async login(email,password) {
        let user = await db("users").where({email});
        if(await bcrypt.compare(password,user.password)) {
            return user;
        }
        throw Error ("Unauthorized");

    }
    static async create(
        email,
        username,
        firstName,
        lastName,
        password
    ) {
        return db("users").insert({
            email,username,firstName,lastName,
            password: await bcrypt.hash(password,10)
        });

    }
}
