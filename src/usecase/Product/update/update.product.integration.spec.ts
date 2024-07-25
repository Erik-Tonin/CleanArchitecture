import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "../find/find.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

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
    
    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
    
        const product = new Product("123", "John", 4);
   
        await productRepository.create(product);
    
        const input = {
          id: "123",
        };

        const product1 = await productRepository.find(input.id);
        
        const output = new Product
        (
            product1.id,
            "Tonico",
            product1.price
        );

        productRepository.update(output);

        await productRepository.find(output.id);

        const result = await usecase.execute(output);
    
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(output.name);
        expect(result.price).toEqual(output.price);
    });
})