const { API_ROOT } = require("../constants");
const UsersRoute = require("./users");

module.exports = function(app) {
    app.use(`${API_ROOT}/users`, UsersRoute);
}
  