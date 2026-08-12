import express from "express";

import {
    createUser,
    getUsers
} from "../Controllers/user.controller.js";

import {
    authenticateAdmin
} from "../Middleware/auth.middleware.js";

const router = express.Router();

// Public
router.post("/", createUser);

// Admin only
router.get("/", authenticateAdmin, getUsers);

export default router;
