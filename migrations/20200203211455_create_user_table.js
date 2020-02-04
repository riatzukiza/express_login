
exports.up = function(knex) {
    return knex.schema.createTable('users',(table) => {
        table.increments("id");
        table.string("userName");
        table.string("password");
        table.string("email");
        table.string("firstName");
        table.string("lastName");
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
