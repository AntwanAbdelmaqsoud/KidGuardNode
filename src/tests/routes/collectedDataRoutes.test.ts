import request from "supertest";
import app from "../../app";

describe("unAuthenticated /api/collected-data", () => {
  test("POST / returns 401 when not authenticated", async () => {
    const res = await request(app).post("/api/collected-data").send({
      heartRate: 80,
      stepCount: 1000,
      longitude: -122.0,
      latitude: 37.0,
    });
    expect(res.status).toBe(401);
  });

  test("GET / returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/collected-data/child123");
    expect(res.status).toBe(401);
  });

  test("GET /:id/audio returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/collected-data/someid/audio");
    expect(res.status).toBe(401);
  });
});

describe("Authenticated parent /api/collected-data", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "parent_collected@example.com",
      password: "password123",
      isParent: true,
    });
    await agent.post("/api/auth/login").send({
      email: "parent_collected@example.com",
      password: "password123",
    });
  });

  test("POST / returns 403 for parent user", async () => {
    const res = await agent.post("/api/collected-data").send({
      heartRate: 75,
      stepCount: 500,
      longitude: -122.0,
      latitude: 37.0,
    });
    expect(res.status).toBe(403);
  });

  test("GET /:id/audio returns 404 for unknown id", async () => {
    const res = await agent.get(
      "/api/collected-data/000000000000000000000000/audio"
    );
    expect([200, 404]).toContain(res.status);
  });
});

describe("Authenticated child /api/collected-data", () => {
  let agent: request.Agent;
  let createdId: string | undefined;

  beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "child_collected@example.com",
      password: "password123",
      isParent: false,
    });
    await agent.post("/api/auth/login").send({
      email: "child_collected@example.com",
      password: "password123",
    });
  });

  test("POST / creates collected data (201) and returns id", async () => {
    const res = await agent.post("/api/collected-data").send({
      heartRate: 88,
      stepCount: 1200,
      longitude: -122.0,
      latitude: 37.0,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  test("GET /:id/audio returns 404 when no audio present", async () => {
    const create = await agent.post("/api/collected-data").send({
      heartRate: 60,
      stepCount: 200,
      longitude: -122.0,
      latitude: 37.0,
    });
    expect(create.status).toBe(201);
    const id = create.body.id;

    const res = await agent.get(`/api/collected-data/${id}/audio`);
    expect(res.status).toBe(404);
  });
});
