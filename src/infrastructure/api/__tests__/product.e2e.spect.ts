import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Erik",
        price: 4
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Erik");
    expect(response.body.price).toBe(4);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Erik",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    await request(app)
      .post("/product")
      .send({
        name: "Erik",
        price: 5
      });
    
    await request(app)
      .post("/product")
      .send({
        name: "Tonin",
        price: 6
      });

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product = listResponse.body.products[0];
    expect(product.name).toBe("Erik");
    expect(product.price).toBe(5);
    
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Tonin");
    expect(product2.price).toBe(6);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<name>Erik</name>`);
    expect(listResponseXML.text).toContain(`<name>Tonin</name>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
