'use strict';
const db = require('pg');
const initialData = require('../src/mocks/cartsInitialData.mock.json');
const dbClient = new db.Client();

/**
 *   carts:
 *     id - uuid (Primary key)
 *     user_id - uuid, not null (It's not Foreign key, because there is no user entity in DB)
 *     created_at - date, not null
 *     updated_at - date, not null
 *     status - enum ("OPEN", "ORDERED")
 *
 *   cart_items:
 *     cart_id - uuid (Foreign key from carts.id)
 *     product_id - uuid
 *     count - integer (Number of items in a cart)
 *
 *   orders:
 *     id - uuid
 *     user_id - uuid
 *     cart_id - uuid (Foreign key from carts.id)
 *     payment - JSON
 *     delivery - JSON
 *     comments - text
 *     status - ENUM or text
 *     total - number
 */

module.exports.up = async function(next) {
  await dbClient.connect();

  const valuesCarts = initialData.carts
    .map(
      item =>
        `('${item.id}', '${item.user_id}', TO_TIMESTAMP('${item.created_at}', 'YYYY-MM-DD'), TO_TIMESTAMP('${item.updated_at}', 'YYYY-MM-DD'), '${item.status}')`,
    )
    .join(', ');

  const valuesCartItems = initialData.cart_items
    .map(
      ({ cart_id, product_id, count }) =>
        `('${cart_id}', '${product_id}', ${count})`,
    )
    .join(', ');

  console.log(valuesCartItems);

  await dbClient.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await dbClient
    .query(
      `
             CREATE TABLE IF NOT EXISTS carts
             (
                 id          UUID DEFAULT uuid_generate_v4(),
                 user_id     UUID NOT NULL,
                 created_at  DATE NOT NULL,
                 updated_at  DATE NOT NULL,
                 status      TEXT
             );
             INSERT INTO carts (id, user_id, created_at, updated_at, status)
             VALUES ${valuesCarts};
         `,
    )
    .then(result => console.log('Carts table created'))
    .catch(err => console.error('Error creating carts table:', err));

  await dbClient
    .query(
      `
             CREATE TABLE IF NOT EXISTS cart_items
             (
                 cart_id        UUID,
                 product_id     UUID,
                 count          INTEGER
             );
             INSERT INTO cart_items (cart_id, product_id, count)
             VALUES ${valuesCartItems};
         `,
    )
    .then(result => console.log('Cart_items table created'))
    .catch(err => console.error('Error creating cart_items table:', err));

  await dbClient
    .query(
      `
             CREATE TABLE IF NOT EXISTS orders
             (
                 id          UUID DEFAULT uuid_generate_v4(),
                 user_id     UUID,
                 cart_id     UUID,
                 payment     JSON,
                 delivery    JSON,
                 comments    TEXT,
                 status      TEXT,
                 total       DECIMAL       
             );
         `,
    )
    .then(result => console.log('Orders table created'))
    .catch(err => console.error('Error creating orders table:', err));

  await dbClient
    .query(
      `
             CREATE TABLE IF NOT EXISTS users
             (
                 id          UUID DEFAULT uuid_generate_v4(),
                 name        TEXT,
                 email       TEXT,
                 password    TEXT    
             );
         `,
    )
    .then(result => console.log('Users table created'))
    .catch(err => console.error('Error creating users table:', err));

  await dbClient.end();
};

module.exports.down = async function(next) {
  await dbClient.connect();

  await dbClient.query(`DROP TABLE carts`);
  await dbClient.query(`DROP TABLE cart_items`);
  await dbClient.query(`DROP TABLE orders`);
  await dbClient.end();
};
