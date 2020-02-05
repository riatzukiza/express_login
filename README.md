# express_login

# install
`yarn`


# Migrate
`npm install -g knex`

`knex migrate:latest`

you might have to run it twice, not sure why, but the tags migration gets run before the migration for the posts 
finishes, and there is a foreign key.

# test

`npm install -g ava`
`ava`

# run it

`yarn start`
