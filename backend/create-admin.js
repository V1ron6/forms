import bcrypt from "bcrypt";
import sql from "./db.js";

const username = "admin";
const password = "ChangeThisPassword123!";

const hashedPassword = await bcrypt.hash(password, 12);

await sql`
    INSERT INTO admins (username, password)
    VALUES (${username}, ${hashedPassword})
`;

console.log("Admin created successfully");

process.exit();
