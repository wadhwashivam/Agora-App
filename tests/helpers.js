import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";

export async function resetDb(){
    await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "Comment", "Like", "Follow", "Post", "User" CASCADE'
    );
}

let counter = 0;

export async function createUserWithToken({ username } = {}) {
    counter += 1;
    const password = "password123";
    const user = await prisma.user.create({
        data: {
            username: username ?? `user${counter}`,
            name: `Test User ${counter}`,
            password: await bcrypt.hash(password, 4),
        },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: "1h"})
    return {user, token, password};
}

