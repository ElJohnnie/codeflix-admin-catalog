import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({ tableName: "categories",
  timestamps: false, })
export class CategoryModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  declare category_id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description: string | null;

  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_active: boolean;
  declare created_at: Date;
}