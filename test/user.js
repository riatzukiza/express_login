let test = require("ava");
let fetch = require("node-fetch");
let db = require("../app/db/db.service.js");
let faker = require("faker");

let userService = require("../app/user/user.service.js");

let app = require("../app/server");
let server;

test.before(async t => {
    t.log("What?");
    return new Promise((resolve,reject) => {
        server = app.listen(0,() => {
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
        userName:faker.internet.userName(),
        password:faker.internet.password(),
        firstName:faker.name.firstName(),
        lastName:faker.name.lastName()
    };

    let url = `http://localhost:${server.address().port}/api/v1/user/create`;

    let res = await fetch(url,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(userData)
    });

    t.truthy((await res.json()).token);

    let users = await db("users") .where({ email:userData.email });
    t.is(users.length,1);
    t.pass();

});
test("User can login through api",async t => {
    let userData = {
        email:faker.internet.email(),
        userName:faker.internet.userName(),
        password:faker.internet.password(),
        firstName:faker.name.firstName(),
        lastName:faker.name.lastName()
    };
    await userService.create(
        userData.email,
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.password
    )
    let url = `http://localhost:${server.address().port}/api/v1/user/login`;
    let res = await fetch(url,{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            userName:userData.userName,
            password:userData.password
        })
    });

    t.truthy((await res.json()).token);
});
