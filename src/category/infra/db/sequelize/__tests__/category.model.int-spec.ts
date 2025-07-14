import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';

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
});