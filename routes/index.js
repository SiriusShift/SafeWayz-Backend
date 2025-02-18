const UserRouter = require('./user')

const runRouters = (app) => {
    app.use("/", UserRouter);
}

module.exports = {
    runRouters
}