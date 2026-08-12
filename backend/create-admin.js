import bcrypt from "bcryptjs";
import sql from "./Configs/db.js";
import dotenv from "dotenv"

dotenv.config()
const username = process.env.admin;
const password = process.env.adminpass;

const hashedPassword = await bcrypt.hash(password, 12);

await sql`
    INSERT INTO admins (username, password)
    VALUES (${username}, ${hashedPassword})
`;

console.log("Admin created successfully");

process.exit();
