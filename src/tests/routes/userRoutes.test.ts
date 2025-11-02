import request from "supertest";
import app from "../../app";

describe("unAuthenticated /api/user", () => {
  test("GET returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/user");
    expect(res.status).toBe(401);
  });
  test("PUT returns 401 when not authenticated", async () => {
    const res = await request(app).put("/api/user").send({
      name: "New Name",
      photoUrl: "http://example.com/photo.jpg",
      isParent: true,
    });
    expect(res.status).toBe(401);
  });
  test("DELETE returns 401 when not authenticated", async () => {
    const res = await request(app).delete("/api/user");
    expect(res.status).toBe(401);
  });
});

describe("Authenticated /api/user", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    await agent
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password" });
    await agent
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password" });
  });
  test("GET returns user info when authenticated", async () => {
    const res = await agent.get("/api/user");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  test("PUT returns 400 when data is invalid", async () => {
    const res = await agent.put("/api/user").send({});
    expect(res.status).toBe(400);
  });

  test("PUT updates user name and returns 200", async () => {
    const res = await agent.put("/api/user").send({
      name: "New Name",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.name).toBe("New Name");
  });

  test("PUT updates user photoUrl and returns 200", async () => {
    const res = await agent.put("/api/user").send({
      photoUrl: "http://example.com/photo.jpg",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.photoUrl).toBe("http://example.com/photo.jpg");
  });

  test("PUT updates user isParent and returns 200", async () => {
    const res = await agent.put("/api/user").send({
      isParent: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.isParent).toBe(true);
  });

  test("PUT updates user name, photoUrl, isParent and returns 200", async () => {
    const res = await agent.put("/api/user").send({
      name: "New Name",
      photoUrl: "http://example.com/photo.jpg",
      isParent: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.name).toBe("New Name");
    expect(res.body.user.photoUrl).toBe("http://example.com/photo.jpg");
    expect(res.body.user.isParent).toBe(true);
  });

  test("DELETE deletes user account and returns 200", async () => {
    const res = await agent.delete("/api/user");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User account deleted");
  });
});
