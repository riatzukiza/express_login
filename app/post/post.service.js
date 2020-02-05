let db = require("../db/db.service.js");
module.exports = class {
    static async create (authorId,title,content,tags = []) {
        let [postId] = await db("posts").insert({authorId,title,content});
        for(let tag of tags) {
            let [taggedUser] = await db("users").where({userName:tag});
            console.log("tag data",{postId,userId:taggedUser.id});
            console.log("tag entry",await db("tags").insert({
                userId:taggedUser.id,
                postId
            }))
            
        }
        return postId;

    }
    static async list () {
        let postEntries = await db("posts").select();

        return Promise.all(postEntries.map(async entry => {
            let tags = await db("tags").where({postId:entry.id});
            return {
                authorId:entry.authorId,
                id:entry.id,
                content:entry.content,
                title:entry.title,
                tags
            };
        }));

    }
}
