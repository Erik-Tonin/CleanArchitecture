import CustomerRepositoryInterface from "../../../../../domain/customer/repository/customer-repository.interface";
import Product from "../../../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../../../domain/product/repository/product-repository.interface";
import ProductModel from "../../../../product/repository/sequelize/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
  async create(entity: Product): Promise<void> {
    await ProductModel.create({
      id: entity.id,
      name: entity.name,
      price: entity.price
    });
  }

  async update(entity: Product): Promise<void> {
    await ProductModel.update(
      {
        name: entity.name,
        price: entity.price
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Product> {
    let productModel;
    try {
        productModel = await ProductModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Product not found");
    }
    const product = new Product(id, productModel.name, productModel.price);

    return product;
  }

  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();

    const products = productModels.map((productModels) => {
      let product = new Product(productModels.id, productModels.name, productModels.price);
      return product;
    });

    return products;
  }
}
