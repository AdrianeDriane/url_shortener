import { knex } from "knex";
import { config } from "../config/index";

export const db = knex({
  client: "pg",
  connection: {
    connectionString: config.database.connectionUri,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
