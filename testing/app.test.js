const request = require('supertest');
const app = require('../app.js');

const usertoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzcxMjc5YTg3NDkzMzk3YzNhYWRhMGYiLCJpYXQiOjE2Njg5MjYxNjF9.8XqxEBc8pmVHSfYN4Y1TRX9laWUSlTLcKYPZ92c9CAc"
const admintoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjM4MzA0MTQyYjgyOTI4ZTIxOTFlMTlkIiwiaWF0IjoxNjcwMjY1ODA2fQ.4CRRKNwKodUTRY1NPatr9zCpjh-j3k_hPS-y2Ff1Pt0"

// User
  test("User register test", async () => {
    await request(app)
      .post("/user/insert")
      .send({
        email: "apitestyal12@gmail.com",
        password: "testyal",
        phone:"+9779840311032"
      })
      .expect(200)
  })

  test("User login test", async () => {
    await request(app)
      .post("/user/login")
      .send({
        email: "apitestyal1@gmail.com",
        password: "testyaala"
      })
      .expect("Content-Type", /json/)
      .expect(200)
  });

  //View Profile
  test("View profile", async () => {
    await request(app)
        .get("/user/profile")
        .set("Authorization", usertoken)
        .expect("Content-Type", /json/)
    });

  // Edit Phone number
  test("Update Phone", async () =>{
    await request(app)
    .put("/user/update")
    .set("Authorization", usertoken)
    .send({
      phone: "9840311031"
    })
    .expect(200)
  })

  // Update Information
  test("Update Information", async () =>{
    await request(app)
    .put("/user/update")
    .set("Authorization", usertoken)
    .send({
      firstname: "PrabTest",
      lastname: "AryalTest",
    })
    .expect(200)
  })

  // Update Information
  test("Update Information", async () =>{
    await request(app)
    .put("/user/update")
    .set("Authorization", usertoken)
    .send({
      firstname: "PrabTest",
      lastname: "AryalTest",
    })
    .expect(200)
  })

  //Admin
  // Admin Login
  test("Admin Login", async () =>{
    await request(app)
    .post("/admin/login")
    .send({
      email: "duku.aryal@gmail.com",
      lastname: "123456",
    })
    .expect(200)
  })

  //Admin Dashboard
  test("Admin Login", async () =>{
    await request(app)
    .get("/admin/dashboard", admintoken)
    .expect(201)
  })




