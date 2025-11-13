import request from "supertest";
import app from "../../app";

describe("unAuthenticated /api/allowed-zone", () => {
  test("POST / returns 401 when not authenticated", async () => {
    const response = await request(app).post("/api/allowed-zone/").send({
      childId: "child1",
      zoneName: "Home",
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 100,
    });
    expect(response.status).toBe(401);
  });
  test("GET / returns 401 when not authenticated", async () => {
    const response = await request(app).get("/api/allowed-zone/child1");
    expect(response.status).toBe(401);
  });
  test("DELETE /:zoneId returns 401 when not authenticated", async () => {
    const response = await request(app).delete(`/api/allowed-zone/zone12345`);
    expect(response.status).toBe(401);
  });
});

describe("Authenticated non-parent /api/allowed-zone", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "nonparent@example.com",
      password: "password123",
      isParent: false,
    });
    await agent.post("/api/auth/login").send({
      email: "nonparent@example.com",
      password: "password123",
    });
  });
  test("POST / returns 403 for non-parent user", async () => {
    const response = await agent.post("/api/allowed-zone/").send({
      childId: "child1",
      zoneName: "Home",
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 100,
    });
    expect(response.status).toBe(403);
  });
  test("GET / returns 403 for non-parent user", async () => {
    const response = await agent.get("/api/allowed-zone/child1");
    expect(response.status).toBe(403);
  });
  test("DELETE /:zoneId returns 403 for non-parent user", async () => {
    const response = await agent.delete(`/api/allowed-zone/zone12345`);
    expect(response.status).toBe(403);
  });
});

describe("Authenticated parent /api/allowed-zone", () => {
  let agent: request.Agent;
  beforeEach(async () => {
    agent = request.agent(app);
    await agent.post("/api/auth/register").send({
      email: "parent@example.com",
      password: "password",
      isParent: true,
    });
    await agent.post("/api/auth/login").send({
      email: "parent@example.com",
      password: "password",
    });
  });
  test("POST / creates allowed zone", async () => {
    const response = await agent.post("/api/allowed-zone/").send({
      childId: "child1",
      zoneName: "Home",
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 100,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("zoneName");
  });
  test("GET / retrieves allowed zones", async () => {
    // First, create a zone to ensure there is data to retrieve
    const Res = await agent.post("/api/allowed-zone/").send({
      childId: "child1",
      zoneName: "Home",
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 100,
    });
    const response = await agent.get("/api/allowed-zone/child1");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty("_id");
    expect(response.body[0]).toHaveProperty("zoneName");
  });
  test("DELETE /:zoneId removes allowed zone", async () => {
    // First, create a zone to delete
    const Res = await agent.post("/api/allowed-zone/").send({
      childId: "child1",
      zoneName: "Home",
      centerLat: 37.7749,
      centerLng: -122.4194,
      radiusMeters: 100,
    });
    expect(Res.status).toBe(201);
    expect(Res.body).toHaveProperty("_id");
    expect(Res.body).toHaveProperty("zoneName");

    // Now delete the created zone
    const zoneId = Res.body._id;
    const deleteRes = await agent.delete(`/api/allowed-zone/${zoneId}`);
    expect(deleteRes.status).toBe(204);
  });
});
