import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../database/prisma.js";
import { resetDb, createUserWithToken } from "./helpers.js";

beforeEach(async () => {
    await resetDb();
});

describe('GET /users/:id', () => {

    it("returns 404 when the user id is unknown", async () => {
        const{token} = await createUserWithToken();

        const res = await request(app).get("/users/does-not-exist").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});

describe('POST /users/:id/follow', () => {

    it("follows on the first request and unfollows on the second", async () => {
        const { user: alice, token: aliceToken } = await createUserWithToken();
        const { user: bob } = await createUserWithToken();

        const first = await request(app).post(`/users/${bob.id}/follow`).set("Authorization", `Bearer ${aliceToken}`);

        expect(first.status).toBe(201);
        expect(first.body.following).toBe(true);
        expect(await prisma.follow.count({ where: { followerId: alice.id, followingId: bob.id } })).toBe(1);
        
        const second = await request(app).post(`/users/${bob.id}/follow`).set("Authorization", `Bearer ${aliceToken}`);

        expect(second.status).toBe(200);
        expect(second.body.following).toBe(false);
        expect(await prisma.follow.count({ where: { followerId: alice.id, followingId: bob.id } })).toBe(0);
    });
    
    it("returns 400 when a user tries to follow themselves", async () => {
        const {user, token} = await createUserWithToken();

        const res = await request(app).post(`/users/${user.id}/follow`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(await prisma.follow.count()).toBe(0);
    });

});

describe('PATCH /users/:id', () => {

    it("returns 401 when patching someone else's profile",async () => {
        const { token: aliceToken } = await createUserWithToken();
        const { user: bob } = await createUserWithToken();

        const res = await request(app).patch(`/users/${bob.id}`).set("Authorizaiton", `Bearer ${aliceToken}`).send({ bio: "hacked"});
        
        expect(res.status).toBe(401);
        const bobAfter = await prisma.user.findUnique({ where: { id : bob.id }});
        expect(bobAfter.bio).toBe(bob.bio);
    });

    it("returns 200 and saves the change when editing your own profile", async() => {
        const {user: alice, token: aliceToken} = await createUserWithToken();

        const res = await request(app).patch(`/users/${alice.id}`).set("Authorization", `Bearer ${aliceToken}`).send({ bio: "New bio"});

        expect(res.status).toBe(200);
        expect(res.body.bio).toBe("New bio");
        const saved = await prisma.user.findUnique({ where: { id: alice.id }});
        expect(saved.bio).toBe("New bio");
    });
});