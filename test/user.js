let test = require("ava");
let fetch = require("node-fetch");
let db = require("../app/db/db.service.js");
let faker = require("faker");

let app = require("../app/server");

test.before(async t => {
    t.log("What?");
    return new Promise((resolve,reject) => {
        console.log("this is happening");
        app.listen(0,() => {
            console.log("listening")
            app.off("error",reject)
            t.pass()
            resolve()
        })
            .once("error",reject);
    });
});

test("can create user through api",async t => {
    let userData = {
        email:faker.internet.email(),
        username:faker.internet.userName(),
        password:faker.internet.password()
    };
    console.log("creating test user",userData);
    let res = await fetch("http://localhost:${app.PORT}/api/v1/user/create",{
        method:"POST",
        body:JSON.stringify()
    });
    let users = await db .select("users") .where({ email:"example@example.com" });
    t.is(users.length,1);
    t.pass();

});
test.todo("User can login through api");
