import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../database/prisma.js";
import { resetDb, createUserWithToken } from "./helpers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

beforeEach(async () => {
    await resetDb();
});

describe('POST /signup', () => {
    const validBody = {
        username: "shiv_test",
        name: "Shiv",
        password: "secret123",
        confirmPassword: "secret123",
    };

    it("creates a user and stores a hashed password", async () => {
        const res = await request(app).post("/signup").send(validBody);

        expect(res.status).toBe(201);
        const saved = await prisma.user.findUnique({ where: { username: "shiv_test" } });
        expect(saved).not.toBeNull();
        expect(saved.password).not.toBe("secret123");
    });

    it("returns 409 when the username is taken", async ()=>{
        await createUserWithToken({ username: "shiv_test" });
        const res = await request(app).post("/signup").send(validBody);
        expect(res.status).toBe(409);
    });

    it("returns 400 when passwords don't match", async () => {
        const res = await request(app).post("/signup").send({ ...validBody, confirmPassword: "different"});

        expect(res.status).toBe(400);
        expect(res.body.errors[0].path).toBe("confirmPassword");
    });

    it("returns 400 when the username is shorter than 3 characters", async () =>{
        const res = await request(app).post("/signup").send({...validBody, username: "ab"});

        expect(res.status).toBe(400);
        expect(res.body.errors[0].path).toBe("username");
    });

    it("accepts a username at the minimum length of 3", async () => {
        const res = await request(app).post("/signup").send({...validBody, username: "abc"});

        expect(res.status).toBe(201);
        const saved = await prisma.user.findUnique({ where: {username : "abc"}});
        expect(saved).not.toBeNull();
    });

    it("returns 400 when the password is less than 6 characters", async () => {
        const res = await request(app).post("/signup").send({...validBody, password: "secre", confirmPassword: "secre"});

        expect(res.status).toBe(400);
        expect(res.body.errors[0].path).toBe("password");
    });

    it("accepts a password at the minimum length of 6", async () => {
        const res = await request(app).post("/signup").send({...validBody, password: "secret", confirmPassword: "secret"});

        expect(res.status).toBe(201);
        const saved = await prisma.user.findUnique({ where: { username: "shiv_test"}});
        expect(saved).not.toBeNull();
        expect(await bcrypt.compare("secret", saved.password)).toBe(true);
    });
});

describe('POST /login', () => {
    it("returns 200 and a valid token for correct credentials", async () => {
        const { user, password } = await createUserWithToken();

        const res = await request(app).post("/login").send({ username : user.username, password});

        expect(res.status).toBe(200);
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded.id).toBe(user.id);
    });

    it("returns 401 when the password is wrong", async () => {
        const { user } = await createUserWithToken();

        const res = await request(app).post("/login").send({ username: user.username, password: "wrongpass"});

        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });

    it("returns 401 when logging in with an unknown username", async () => {
        const res = await request(app).post("/login").send({ username: "nobody_here", password: "whatever123" });
        
        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();
    });
});

describe("Protected routes", () => {
    it("returns 401 when no token is sent", async () => {
        const res = await request(app).get("/posts");

        expect(res.status).toBe(401);
    });

    it("returns 401 when the token is invalid", async () => {
        const res = await request(app).get("/posts").set("Authorization", "Bearer abc");

        expect(res.status).toBe(401);
    });

    it("returns 200 with a valid token", async () => {
        const {token} = await createUserWithToken();

        const res = await request(app).get("/posts").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });
});