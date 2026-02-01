/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("clicks"))) {
    await knex.schema.createTable("clicks", (t) => {
      // Primary key
      t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());

      // Foreign key to urls table
      t.uuid("url_id").notNullable();
      t.foreign("url_id").references("id").inTable("urls").onDelete("CASCADE");
      t.index("url_id");

      // Request metadata
      t.text("referrer").nullable();
      t.text("user_agent").nullable();

      // Timestamp (immutable, no updated_at needed for clicks)
      t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      t.index("created_at");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasTable("clicks")) {
    await knex.schema.dropTable("clicks");
  }
};
