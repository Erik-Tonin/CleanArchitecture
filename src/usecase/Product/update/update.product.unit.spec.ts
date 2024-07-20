import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const product = ProductFactory.create("a", "John", 4);

    const input = {
      id: product.id,
      name: "John Updated",
      price: 5
    };

    const MockRepository = () => {
      return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn().mockResolvedValue(null),
      };
    };

    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const expectedOutput = {
      id: product.id,
      name: "John Updated",
      price: 5
    };

    const result = await productUpdateUseCase.execute(input);

    expect(result).toEqual(expectedOutput);

    expect(productRepository.update).toHaveBeenCalledWith(expect.objectContaining({
      id: product.id,
      name: "John Updated",
      price: 5
    }));
  });
});