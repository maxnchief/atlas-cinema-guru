#!/usr/bin/env node

const { db } = require("@vercel/postgres");

async function main() {
  const client = await db.connect();
  await client.sql`
    INSERT INTO users (name, email, password)
    VALUES ('Max', 'logandogan@gmail.com', 'password123')
    ON CONFLICT (email) DO NOTHING;
  `;
  console.log("User added: logandogan@gmail.com");
  await client.end();
}

main().catch(err => {
  console.error("Error adding user:", err);
  process.exit(1);
});
