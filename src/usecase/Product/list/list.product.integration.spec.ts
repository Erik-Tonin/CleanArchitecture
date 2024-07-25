import { Sequelize } from "sequelize-typescript/dist/sequelize/sequelize/sequelize";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "../find/find.product.usecase";
import Product from "../../../domain/product/entity/product";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test find product use case", () => {
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
    
    it("should list the product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);
    
        const product = new Product("123456", "John", 879);
        await productRepository.create(product);
    
        const input = {
          id: "123456",
          name: "John",
          price: 879
        };
   
        await productRepository.findAll();

        const result = await usecase.execute(input);
       
        expect(result.name).toEqual(input.name);
        expect(result.price).toEqual(input.price);
  });
})