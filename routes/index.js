const UserRouter = require('./user')
const ReportRouter = require('./report')
const runRouters = (app) => {
    app.use("/api/", UserRouter);
    app.use("/api/reports", ReportRouter);
}

module.exports = {
    runRouters
}