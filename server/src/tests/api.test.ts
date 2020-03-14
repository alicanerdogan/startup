import request from "supertest";
import { app, closeServer } from "../";
import { closeDBConnection, resetDB } from "../db";

const USER_CREDENTIALS = {
  email: "test_user@test_user123.com",
  password: "123123"
};

describe("APIs", () => {
  afterAll(async () => {
    await resetDB();
    await closeDBConnection();
    await closeServer();
  });

  it("should return 404 Not Found for the paths nonexistant", async () => {
    await request(app)
      .get("/api")
      .expect(404)
      .then();
  });

  describe("Users", () => {
    it("should allow user creation", async () => {
      await request(app)
        .post("/api/users")
        .send(USER_CREDENTIALS)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201, { email: USER_CREDENTIALS.email })
        .then();
    });

    it("should not allow unauthorized calls to get user payload", async () => {
      await request(app)
        .get("/api/users")
        .expect(401)
        .then();
    });

    describe("Sessions", () => {
      it("should allow session creation with valid credentials", async () => {
        await request(app)
          .post("/api/sessions")
          .send(USER_CREDENTIALS)
          .set("Accept", "application/json")
          .expect(201)
          .expect(res => expect(res.body.token).toBeTruthy())
          .then(res => res.body.token as string);
      });
    });
  });

  describe("Resource", () => {
    it("should limit usage of a limited resource when the user is anonymous", async () => {
      await request(app)
        .get("/api/public/resource")
        .expect(200)
        .then();

      await request(app)
        .get("/api/public/resource")
        .expect(429)
        .then();
    });

    it("should limit usage of a limited resource with different set of rules when the user is logged in", async () => {
      const token = await request(app)
        .post("/api/sessions")
        .send(USER_CREDENTIALS)
        .set("Accept", "application/json")
        .then(res => res.body.token as string);

      await request(app)
        .get("/api/resource")
        .set("Authorization", token)
        .expect(200)
        .then();

      await request(app)
        .get("/api/resource")
        .set("Authorization", token)
        .expect(200)
        .then();

      await request(app)
        .get("/api/resource")
        .set("Authorization", token)
        .expect(429)
        .then();
    });
  });
});
