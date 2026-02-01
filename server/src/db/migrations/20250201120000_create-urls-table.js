/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const {
  createOnUpdateTrigger,
  dropOnUpdateTrigger,
  createUpdateAtTriggerFunction,
  dropUpdatedAtTriggerFunction,
} = require("../util/db-util");

exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("urls"))) {
    await knex.schema.createTable("urls", (t) => {
      // Primary key
      t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());

      // URL fields
      t.text("original_url").notNullable();
      t.string("slug", 8).unique().notNullable().index();

      // Optional expiration
      t.timestamp("expiration_date").nullable();

      // Analytics fields
      t.integer("click_count").defaultTo(0).notNullable();
      t.integer("expired_access_count").defaultTo(0).notNullable();

      // Timestamps
      t.timestamps(true, true, true);
    });

    // Set up automatic updated_at timestamp management
    await createUpdateAtTriggerFunction(knex);
    await createOnUpdateTrigger(knex, "urls");
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasTable("urls")) {
    await knex.schema.dropTable("urls");
    await dropOnUpdateTrigger(knex, "urls");
    await dropUpdatedAtTriggerFunction(knex);
  }
};
