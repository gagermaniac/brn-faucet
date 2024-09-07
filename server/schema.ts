import { date, pgTable, serial, text, uuid, varchar } from "drizzle-orm/pg-core";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export const claimTx = pgTable('claim-tx', {
    uid: uuid('uid').defaultRandom(),
    address: varchar('address', { length: 75 }),
    ip: varchar('ip', { length: 30 }),
    created_at: date('created_at').defaultNow(),
    hash: text('hash'),
});

const client = postgres(process.env.DATABASE_URL ?? '')
export const db = drizzle(client);