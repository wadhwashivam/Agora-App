import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
    it("returns 200 with the status message", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body.message).toBeDefined();
    });
});