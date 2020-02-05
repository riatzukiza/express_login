
exports.up = async function(knex) {
    if(!await knex.schema.hasTable("posts")) {
        return knex.schema.createTable("posts",(table) => {
            table.increments("id").primary();
            table.integer("authorId").unsigned();
            table.foreign("authorId").references("users.id");
            table.text("content");
            table.string("title");
        });
    }
};

exports.down = function(knex) {
    return knex.schema.dropTable("posts");
};
