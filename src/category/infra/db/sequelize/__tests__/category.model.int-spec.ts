import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { DataType } from 'sequelize-typescript';

describe('CategoryModel integration test', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
    });
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a category model', async () => {
    await CategoryModel.create({
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Category',
      description: 'This is a test category',
      is_active: true,
      created_at: new Date(),
    });
  });

  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      'category_id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });
});