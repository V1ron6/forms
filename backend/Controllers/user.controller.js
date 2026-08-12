import sql from "../Configs/db.js";

export const createUser = async (req, res) => {
    try {
        const {
            name,
            contact,
            hostel,
            invitedBy,
            member
        } = req.body;

        // Validate required fields
        if (!name || !contact || !hostel || !invitedBy) {
            return res.status(400).json({
                success: false,
                message: "Name, contact, hostel and invitedBy are required"
            });
        }

        // Validate member
        if (typeof member !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Member must be true or false"
            });
        }

        // Check for duplicate attendance
        const existingUser = await sql`
            SELECT id
            FROM users
            WHERE contact = ${contact.trim()}
            LIMIT 1
        `;

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Attendance has already been recorded for this contact."
            });
        }

        // Create attendance record
        const result = await sql`
            INSERT INTO users (
                name,
                contact,
                hostel,
                invited_by,
                member
            )
            VALUES (
                ${name.trim()},
                ${contact.trim()},
                ${hostel.trim()},
                ${invitedBy.trim()},
                ${member}
            )
            RETURNING
                id,
                name,
                contact,
                hostel,
                invited_by,
                member,
                created_at
        `;

        return res.status(201).json({
            success: true,
            message: "Attendance recorded successfully",
            data: result[0]
        });

    } catch (error) {

        // Duplicate contact - database protection
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Attendance has already been recorded for this contact."
            });
        }

        console.error("Create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await sql`
            SELECT
                id,
                name,
                contact,
                hostel,
                invited_by,
                member,
                created_at
            FROM users
            ORDER BY created_at DESC
        `;

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {

        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance"
        });
    }
};
