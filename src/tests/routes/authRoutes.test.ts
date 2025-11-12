import request from "supertest";
import app from "../../app";
import { User } from "../../models/User";

describe("Auth (local) integration", () => {
  const email = "test@example.com";
  const password = "password123";

  test("POST /api/auth/register creates user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", email);

    // verify DB state
    const dbUser = await User.findOne({ email }).lean();
    expect(dbUser).toBeDefined();
    expect(dbUser!.email).toBe(email);
  });

  test("POST /api/auth/login authenticates and session persists", async () => {
    // Create user directly (password must be hashed like the register route does)
    await request(app)
      .post("/api/auth/register")
      .send({ email: "login@example.com", password });

    // Use agent to persist cookies between requests
    const agent = request.agent(app);

    // login
    const loginRes = await agent
      .post("/api/auth/login")
      .send({ email: "login@example.com", password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("message", "Login successful");
    expect(loginRes.body).toHaveProperty("user");
    expect(loginRes.body.user).toHaveProperty("email", "login@example.com");

    // subsequent request should be authenticated
    const whoami = await agent.get("/api/user/me");
    expect(whoami.status).toBe(200);
    expect(whoami.body).toHaveProperty("user");
    expect(whoami.body.user).toHaveProperty("email", "login@example.com");
  });
});
