import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../database/prisma.js";
import { resetDb, createUserWithToken } from "./helpers.js";

beforeEach(async () => {
    await resetDb();
});

const validContent = "a".repeat(80);

describe('POST /posts', () => {
    it("creates a post for the logged-in user", async () => {
        const { user, token } = await createUserWithToken();

        const res = await request(app).post("/posts").set("Authorization", `Bearer ${token}`).send({ content: validContent });

        expect(res.status).toBe(201);
        const saved = await prisma.post.findUnique({ where: {id: res.body.id}});
        expect(saved.authorId).toBe(user.id);
    });

    it("returns 400 when the post length is shorter than 60 characters", async () => {
        const { token } = await createUserWithToken();

        const notValidContent = "a".repeat(59);
        
        const res = await request(app).post("/posts").set("Authorization", `Bearer ${token}`).send({content: notValidContent});

        expect(res.status).toBe(400);
        expect(await prisma.post.count()).toBe(0);
    });

    it("returns 400 when the post is longer than 3000 character", async () => {
        const { token } = await createUserWithToken();

        const notValidContent = "a".repeat(3001);

        const res = await request(app).post("/posts").set("Authorization", `Bearer ${token}`).send({content: notValidContent});

        expect(res.status).toBe(400);
        expect(await prisma.post.count()).toBe(0);
    });
});

describe('GET /posts', () => {
    it("shows your own posts and posts from people you follow, but not from others", async () => {
        const { user: alice, token: aliceToken } = await createUserWithToken();
        const { user: bob }  = await createUserWithToken();
        const { user: carol } = await createUserWithToken();

        await prisma.follow.create({ data: { followerId: alice.id, followingId: bob.id }});

        await prisma.post.createMany({
            data: [
                { authorId: alice.id, content: validContent },
                { authorId: bob.id, content: validContent },
                { authorId: carol.id, content: validContent },
            ],
        });

        const res = await request(app).get("/posts").set("Authorization", `Bearer ${aliceToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        
        const authorIds = res.body.map(p => p.postedBy.id);
        expect(authorIds).toContain(alice.id);
        expect(authorIds).toContain(bob.id);
        expect(authorIds).not.toContain(carol.id);
        
    });

    it("caps the page size at 50 even when a larger limit is requested", async () => {
        const{ user, token } = await createUserWithToken();

        await prisma.post.createMany({
            data: Array.from({ length: 55 }, () => ({ authorId: user.id, content: validContent }))
        });

        const res = await request(app).get("/posts?limit=500").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(50);
    });
});

describe('GET /posts/:postId', () => {
    it("returns 404 when post id is unknown", async () => {
        const { token } = await createUserWithToken();

        const res = await request(app).get("/posts/unkownId").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    it("returns the post when it exists", async () => {
        const { user, token } = await createUserWithToken();
        const post = await prisma.post.create({ data: {authorId: user.id, content: validContent}});

        const res = await request(app).get(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(post.id);
        expect(res.body.postedBy.id).toBe(user.id);
    });
});

describe('POST /posts/:postId/comments', () => {
    it("returns 201 for valid comment", async () => {
        const { user, token } = await createUserWithToken();

        const post = await prisma.post.create({data: { authorId: user.id, content: validContent}});
    
        const res = await request(app).post(`/posts/${post.id}/comments`).set("Authorization", `Bearer ${token}`).send({content: "Sample comment"});

        expect(res.status).toBe(201);
        const saved = await prisma.comment.findUnique({ where: {id: res.body.id }});
        expect(saved.postId).toBe(post.id);
        expect(saved.authorId).toBe(user.id);
        expect(saved.content).toBe("Sample comment");
    });

    it("returns 400 when the comment is shorter than 4 characters", async () => {
        const { user, token } = await createUserWithToken();
        const post = await prisma.post.create({ data: { authorId: user.id, content: validContent}});

        const res = await request(app).post(`/posts/${post.id}/comments`).set("Authorization", `Bearer ${token}`).send({ content: "      ab     "});

        expect(res.status).toBe(400);
        expect(await prisma.comment.count()).toBe(0);
    });
});

describe('POST /posts/:postId/likes', () => {
    it("likes on the first request and unlikes on the second", async () => {
        const { user, token } = await createUserWithToken();
        const post = await prisma.post.create({ data: {authorId: user.id, content: validContent }});

        const first = await request(app).post(`/posts/${post.id}/likes`).set("Authorization", `Bearer ${token}`);

        expect(first.status).toBe(201);
        expect(first.body.like).toBe(true);
        expect(await prisma.like.count({ where: {userId: user.id, postId: post.id}})).toBe(1);

        const second = await request(app).post(`/posts/${post.id}/likes`).set("Authorization", `Bearer ${token}`);

        expect(second.status).toBe(200);
        expect(second.body.like).toBe(false);
        expect(await prisma.like.count({ where: { userId: user.id, postId: post.id }})).toBe(0);
    });

    it("returns 404 when liking a post that doesn't exist", async () => {
        const { token } = await createUserWithToken();

        const res = await request(app).post("/posts/does-not-exist/likes").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(await prisma.like.count()).toBe(0);
    });
});