const PORT = process.env.PORT || 3000;
require("./app/server.js").listen(PORT,() => {
    console.log("listening on port",PORT);
});
