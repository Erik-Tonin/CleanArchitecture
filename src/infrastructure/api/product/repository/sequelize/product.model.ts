import {
    Table,
    Model,
    PrimaryKey,
    Column
  } from "sequelize-typescript";

  @Table({
    tableName: "products",
    timestamps: false,
  })
  export default class CustomerModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;
  
    @Column({ allowNull: false })
    declare name: string;
  
    @Column({ allowNull: false })
    declare price: number;

  }