import request from "supertest";
import { app, closeServer } from "../";
import { closeDBConnection, resetDB } from "../db";

const USER_CREDENTIALS = {
  email: "test_user@gmail.com",
  password: "123123123",
};

describe("APIs", () => {
  afterAll(async () => {
    await resetDB();
    await closeDBConnection();
    await closeServer();
  });

  it("should return 404 Not Found for the paths nonexistant", async () => {
    await request(app).get("/api").expect(404).then();
  });

  describe("Users", () => {
    it("should not allow registration with invalid email", async () => {
      await request(app)
        .post("/api/users")
        .send({ ...USER_CREDENTIALS, email: "test" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400, { error: { code: 1001, description: "Invalid email" } })
        .then();
    });

    it("should not allow registration with invalid password", async () => {
      await request(app)
        .post("/api/users")
        .send({ ...USER_CREDENTIALS, password: "12345" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400, {
          error: {
            code: 1001,
            description:
              "Invalid password: It should be at least 8 characters long",
          },
        })
        .then();
    });

    it("should allow registration", async () => {
      await request(app)
        .post("/api/users")
        .send(USER_CREDENTIALS)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .expect((res) => expect(res.body.jwt).toBeTruthy())
        .then();
    });

    it("should not allow session with invalid credentials", async () => {
      await request(app)
        .post("/api/sessions")
        .send({ ...USER_CREDENTIALS, password: "123456789" })
        .set("Accept", "application/json")
        .expect(401)
        .then();
    });

    it("should return session with valid credentials", async () => {
      await request(app)
        .post("/api/sessions")
        .send(USER_CREDENTIALS)
        .set("Accept", "application/json")
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((res) => expect(res.body.jwt).toBeTruthy())
        .then();
    });
  });

  describe.skip("Resource", () => {
    it("should limit usage of a limited resource when the user is anonymous", async () => {
      await request(app).get("/api/public/resource").expect(200).then();

      await request(app).get("/api/public/resource").expect(429).then();
    });

    it("should limit usage of a limited resource with different set of rules when the user is logged in", async () => {
      const token = await request(app)
        .post("/api/sessions")
        .send(USER_CREDENTIALS)
        .set("Accept", "application/json")
        .then((res) => res.body.jwt as string);

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
