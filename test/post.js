let test = require("ava");
let fetch = require("node-fetch");
let db = require("../app/db/db.service.js");
let faker = require("faker");

let userService = require("../app/user/user.service.js");
let postService = require("../app/post/post.service.js");

let app = require("../app/server");
let server;
let mockPostData = (tags) => ({
    title:Array.from({length:5},() => faker.random.word()).join(" "),
    contents:Array.from({length:50},() => faker.random.word()).join(" "),
    tags
});
let mockUserData = () => ({
    email:faker.internet.email(),
    userName:faker.internet.userName(),
    password:faker.internet.password(),
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName()
});

let createMockUser = () => {
    let userData = mockUserData();
    return userService.create(
        userData.email,
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.password
    );
}

test.before(async t => {
    return new Promise((resolve,reject) => {
        server = app.listen(0,() => {
            app.off("error",reject)
            t.pass()
            resolve()
        })
            .once("error",reject);
    });
});



test("User can create post",async t => {
    let userData = mockUserData();

    await userService.create(
        userData.email,
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.password
    );


    let token = await userService.login(
        userData.userName,
        userData.password
    );
    t.log({token});

    let postData = {
        title:Array.from({length:5},() => faker.random.word()).join(" "),
        content:Array.from({length:50},() => faker.random.word()).join(" ")
    };

    let url = `http://localhost:${server.address().port}/api/v1/post/create`;
    let res = await fetch(url,{
        method:"POST",
        headers:{
            "content-type":"application/json",
            "authorization":`Bearer ${token}`
        },
        body:JSON.stringify(postData)
    });
    let {postId} = await res.json();
    let postRow = await db("posts").where({id:postId});
    t.is(postRow.length,1)
});

test("User can tag another user in a post",async t => {

    let userData = mockUserData();

    await userService.create(
        userData.email,
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.password
    );
    let otherUserData = [
        mockUserData(),
        mockUserData(),
        mockUserData(),
        mockUserData()
    ];

    let otherUsers = await Promise.all(
        otherUserData.map(userData => userService.create(
            userData.email,
            userData.userName,
            userData.firstName,
            userData.lastName,
            userData.password
        ))
    );

    let token = await userService.login(
        userData.userName,
        userData.password
    );

    let postData = {
        title:Array.from({length:5},() => faker.random.word()).join(" "),
        contents:Array.from({length:50},() => faker.random.word()).join(" "),
        tags:await Promise.all(otherUsers.map(userData => userData.userName))
    };

    let url = `http://localhost:${server.address().port}/api/v1/post/create`;
    let res = await fetch(url,{
        method:"POST",
        headers:{
            "content-type":"application/json",
            "authorization":`Bearer ${token}`
        },
        body:JSON.stringify(postData)
    });
    let {postId} = await res.json();
    let [postEntry] = await db("posts").where({id:postId});
    let tags = await db("tags").where({postId:postEntry.id});
    t.log("tags",{tags});

    t.true(tags.every(tag => tag.postId === postId));

});
test("Users can view posts",async t => {
    let userData = mockUserData();

    await userService.create(
        userData.email,
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.password
    );

    let token = await userService.login(
        userData.userName,
        userData.password
    );

    let otherUserData = [
        mockUserData(),
        mockUserData(),
        mockUserData(),
        mockUserData()
    ];

    let otherUsers = await Promise.all(
        otherUserData.map(userData => userService.create(
            userData.email,
            userData.userName,
            userData.firstName,
            userData.lastName,
            userData.password
        ))
    );

    let [authorEntry] = await db("users").where({userName:userData.userName});

    let postData = Array.from({length:10},() => mockPostData(otherUsers.map(userData => userData.userName)));

    let postEntries = await Promise.all(
        postData.map(async postData => {
            let postId = await postService.create(
                authorEntry.id,
                postData.title,
                postData.content
            );
            let [postEntry] = await db("posts").where({id:postId});
            return postEntry;
        })
    );

    let url = `http://localhost:${server.address().port}/api/v1/post/list`;
    let res = await fetch(url,{
        headers:{
            "content-type":"application/json",
            "authorization":`Bearer ${token}`
        },
    });
    let body = await res.json();
    for(let result of body) {
        let [entry] = await db("posts").where({id:result.id});
        t.is(entry.id,result.id);
        t.is(entry.title,result.title);
        t.is(entry.authorId,result.authorId);
        t.is(entry.content,result.content);

    }

});
