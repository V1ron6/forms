import express from "express";

import {
    createUser,
    getUsers
} from "../controllers/user.controller.js";

import {
    authenticateAdmin
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.post("/", createUser);

// Admin only
router.get("/", authenticateAdmin, getUsers);

export default router;
