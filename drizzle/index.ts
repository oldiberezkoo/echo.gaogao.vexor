import { neon, neonConfig } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

neonConfig.poolQueryViaFetch = true;
const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL!);

export const db = drizzle({ client: sql });
