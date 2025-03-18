const UserRouter = require('./user')
const ReportRouter = require('./report')
const runRouters = (app, io) => {
    app.use("/api/", UserRouter);
    app.use("/api/reports", ReportRouter(io));
}

module.exports = {
    runRouters
}