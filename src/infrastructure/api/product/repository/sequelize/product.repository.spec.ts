import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../../product/repository/sequelize/product.repository";
import Product from "../../../../../domain/product/entity/product";

describe("Product repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123456","Product 1", 4);
    await productRepository.create(product);

    const productModel = await ProductModel.findOne({ where: { id: "123456" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "123456",
      name: product.name,
      price: product.price
    });
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123456","Product 1", 4);
    await productRepository.create(product);

    product.changeName("Product 2");
    await productRepository.update(product);
    const productModel = await ProductModel.findOne({ where: { id: "123456" } });

    expect(productModel.toJSON()).toStrictEqual({
      id: "123456",
      name: product.name,
      price: product.price
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const product = new Product("123456","Product 1", 4);
    await productRepository.create(product);

    const productResult = await productRepository.find(product.id);

    expect(product).toStrictEqual(productResult);
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository();
    const product1 = new Product("123456","Product 1", 4);
    const product2 = new Product("1234562","Product 2", 5);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const products = await productRepository.findAll();

    expect(products).toHaveLength(2);
    expect(products).toContainEqual(product1);
    expect(products).toContainEqual(product2);
  });
});
