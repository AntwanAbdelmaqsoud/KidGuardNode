import request from "supertest";
import app from "../../app";

describe("unAuthenticated /api/parent-child", () => {
  test("GET /code/generate returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/parent-child/code/generate");
    expect(res.status).toBe(401);
  });
  test("GET /children returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/parent-child/children");
    expect(res.status).toBe(401);
  });
  test("POST /code/verify returns 401 when not authenticated", async () => {
    const res = await request(app)
      .post("/api/parent-child/code/verify")
      .send({ code: "somecode" });
    expect(res.status).toBe(401);
  });
  test("DELETE /link returns 401 when not authenticated", async () => {
    const res = await request(app).delete("/api/parent-child/link/child123");
    expect(res.status).toBe(401);
  });
});

describe("Authenticated child user /api/parent-child", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    // Simulate a child user login
    await agent.post("/api/auth/register").send({
      email: "nonparentone@example.com",
      password: "password123",
      isParent: false,
    });
    await agent.post("/api/auth/login").send({
      email: "nonparentone@example.com",
      password: "password123",
    });
  });

  test("GET /code/generate returns 403 for non-parent user", async () => {
    const res = await agent.get("/api/parent-child/code/generate");
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "Forbidden: user must be a parent"
    );
  });
  test("DELETE /link returns 403 for non-parent user", async () => {
    const res = await agent.delete("/api/parent-child/link/child123");
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "Forbidden: user must be a parent"
    );
  });
  test("GET /children returns 403 for non-parent user", async () => {
    const res = await agent.get("/api/parent-child/children");
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      "message",
      "Forbidden: user must be a parent"
    );
  });
  test("POST /code/verify returns 200 for non-parent user", async () => {
    const parentAgent = request.agent(app);
    await parentAgent.post("/api/auth/register").send({
      email: "parent@example.com",
      password: "password123",
      isParent: true,
    });
    await parentAgent.post("/api/auth/login").send({
      email: "parent@example.com",
      password: "password123",
    });
    const linkRes = await parentAgent.get("/api/parent-child/code/generate");
    const res = await agent
      .post("/api/parent-child/code/verify")
      .send({ code: linkRes.body.code });
    expect(res.status).toBe(200);
  });
});

describe("Authenticated parent user /api/parent-child", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    // Simulate a parent user login
    await agent.post("/api/auth/register").send({
      email: "parent@example.com",
      password: "password123",
      isParent: true,
    });
    await agent.post("/api/auth/login").send({
      email: "parent@example.com",
      password: "password123",
    });
  });
  test("GET /code/generate returns 200 for parent user", async () => {
    const res = await agent.get("/api/parent-child/code/generate");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("code");
    expect(res.body).toHaveProperty("expiresAt");
  });

  test("DELETE /link returns 200 for parent user", async () => {
    // Create a link first and grab the verification code
    const linkRes = await agent.get("/api/parent-child/code/generate");
    expect(linkRes.status).toBe(200);
    const code = linkRes.body.code;

    // Simulate a child user registering and verifying the code
    const childAgent = request.agent(app);
    const regRes = await childAgent.post("/api/auth/register").send({
      email: "child@example.com",
      password: "password123",
      isParent: false,
    });
    expect(regRes.status === 201 || regRes.status === 200).toBeTruthy();
    const childId = regRes.body.user?._id || regRes.body.user?.id;

    // Login child to obtain session (if routes require it for verify)
    await childAgent.post("/api/auth/login").send({
      email: "child@example.com",
      password: "password123",
    });

    const verifyRes = await childAgent
      .post("/api/parent-child/code/verify")
      .send({
        childID: childId,
        code,
      });
    expect(verifyRes.status).toBe(200);

    // Now parent deletes the link referencing that child
    const delRes = await agent.delete(`/api/parent-child/link/${childId}`);
    expect(delRes.status).toBe(200);
    expect(delRes.body).toHaveProperty("message", "Link deleted successfully");
  });

  test("GET /children returns 200 for parent user", async () => {
    const res = await agent.get("/api/parent-child/children");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("children");
    expect(Array.isArray(res.body.children)).toBe(true);
  });
});
