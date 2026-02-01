const dotenv = require("dotenv");
const path = require("path");
const { config } = require("../config/index");

dotenv.config({ path: path.join(__dirname, "../../../.env") });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgres",
    connection: {
      connectionString: config.db.connectionUri,
    },
  },
};
