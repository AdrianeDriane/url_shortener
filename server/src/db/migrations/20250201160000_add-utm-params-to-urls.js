/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {
  if (await knex.schema.hasTable("urls")) {
    await knex.schema.alterTable("urls", (t) => {
      t.jsonb("utm_params").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasTable("urls")) {
    await knex.schema.alterTable("urls", (t) => {
      t.dropColumn("utm_params");
    });
  }
};
