
exports.up = async function(knex) {
    if(!await knex.schema.hasTable("tags")) {
        return knex.schema.createTable("tags",(table) => {
            table.increments("id").primary();

            table.integer("userId");
            table.foreign("userId").references("users.id");

            table.integer("postId");
            table.foreign("postId").references("uosts.id");
        });
    }

};

exports.down = function(knex) {
    return knex.schema.dropTable("tags");
};
