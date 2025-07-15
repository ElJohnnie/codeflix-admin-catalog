import { Sequelize } from "sequelize-typescript";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";

describe("CategorySequelizeRepository Integration Tests", () => {
    let sequelize: Sequelize;
    let repository: CategorySequelizeRepository
  
    beforeAll(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        models: [CategoryModel],
      });
      await sequelize.sync({ force: true });
      repository = new CategorySequelizeRepository(CategoryModel);
    });
  
    beforeEach(async () => {
      await CategoryModel.destroy({ where: {} });
    });
  
    afterAll(async () => {
      await sequelize.close();
    });

    test('should insert a category', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await repository.insert(category);
      const found = await CategoryModel.findByPk(category.category_id.id);

      expect(found!.toJSON()).toMatchObject({
        category_id: category.category_id.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      });
    });

    test('should bulk insert categories', async () => {
      const categories = Category.fake().theCategories(3).build() as Category[];
      await repository.bulkInsert(categories);
      
      const found = await CategoryModel.findAll();
      expect(found).toHaveLength(3);
      
      categories.forEach((category, index) => {
        expect(found[index].toJSON()).toMatchObject({
          category_id: category.category_id.id,
          name: category.name,
          description: category.description,
          is_active: category.is_active,
          created_at: category.created_at,
        });
      });
    });

    test('should update a category', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await repository.insert(category);
      
      category.changeName('Updated Name');
      category.changeDescription('Updated Description');
      await repository.update(category);
      
      const found = await CategoryModel.findByPk(category.category_id.id);
      expect(found!.toJSON()).toMatchObject({
        category_id: category.category_id.id,
        name: 'Updated Name',
        description: 'Updated Description',
        is_active: category.is_active,
        created_at: category.created_at,
      });
    });

    test('should throw error when updating non-existent category', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await expect(repository.update(category)).rejects.toThrow(
        `Category Not Found using ID ${category.category_id.id}`
      );
    });

    test('should delete a category', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await repository.insert(category);
      
      await repository.delete(category.category_id);
      
      const found = await CategoryModel.findByPk(category.category_id.id);
      expect(found).toBeNull();
    });

    test('should throw error when deleting non-existent category', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await expect(repository.delete(category.category_id)).rejects.toThrow(
        `Category Not Found using ID ${category.category_id.id}`
      );
    });

    test('should find category by id', async () => {
      const category = Category.fake().aCategory().build() as Category;
      await repository.insert(category);
      
      const found = await repository.findById(category.category_id);
      
      expect(found).toBeInstanceOf(Category);
      expect(found!.category_id.id).toBe(category.category_id.id);
      expect(found!.name).toBe(category.name);
      expect(found!.description).toBe(category.description);
      expect(found!.is_active).toBe(category.is_active);
      expect(found!.created_at).toEqual(category.created_at);
    });


    test('should find all categories', async () => {
      const categories = Category.fake().theCategories(3).build() as Category[];
      await repository.bulkInsert(categories);
      
      const found = await repository.findAll();
      
      expect(found).toHaveLength(3);
      found.forEach((foundCategory, index) => {
        expect(foundCategory).toBeInstanceOf(Category);
        expect(foundCategory.category_id.id).toBe(categories[index].category_id.id);
        expect(foundCategory.name).toBe(categories[index].name);
      });
    });

    describe('search method', () => {
      beforeEach(async () => {
        await CategoryModel.destroy({ where: {} });
        const categories = [
          Category.fake().aCategory().withName('Action').withCreatedAt(new Date('2023-01-01')).build() as Category,
          Category.fake().aCategory().withName('Drama').withCreatedAt(new Date('2023-01-02')).build() as Category,
          Category.fake().aCategory().withName('Comedy').withCreatedAt(new Date('2023-01-03')).build() as Category,
          Category.fake().aCategory().withName('Horror').withCreatedAt(new Date('2023-01-04')).build() as Category,
        ];
        await repository.bulkInsert(categories);
      });

      test('should search without filter', async () => {
        const result = await repository.search({
          page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: null,
        });

        expect(result.items).toHaveLength(2);
        expect(result.total).toBe(4);
        expect(result.current_page).toBe(1);
        expect(result.per_page).toBe(2);
        // Default sort by created_at desc
        expect(result.items[0].name).toBe('Horror');
        expect(result.items[1].name).toBe('Comedy');
      });

      test('should search with filter', async () => {
        const result = await repository.search({
          page: 1,
          per_page: 10,
          sort: null,
          sort_dir: null,
          filter: 'o',
        });

        expect(result.items).toHaveLength(3);
        expect(result.total).toBe(3);
        expect(result.items.map(item => item.name)).toEqual(
          expect.arrayContaining(['Action', 'Comedy', 'Horror'])
        );
      });

      test('should search with sort by name asc', async () => {
        const result = await repository.search({
          page: 1,
          per_page: 10,
          sort: 'name',
          sort_dir: 'asc',
          filter: null,
        });

        expect(result.items).toHaveLength(4);
        expect(result.items.map(item => item.name)).toEqual(['Action', 'Comedy', 'Drama', 'Horror']);
      });

      test('should search with sort by name desc', async () => {
        const result = await repository.search({
          page: 1,
          per_page: 10,
          sort: 'name',
          sort_dir: 'desc',
          filter: null,
        });

        expect(result.items).toHaveLength(4);
        expect(result.items.map(item => item.name)).toEqual(['Horror', 'Drama', 'Comedy', 'Action']);
      });

      test('should search with pagination', async () => {
        const result1 = await repository.search({
          page: 1,
          per_page: 2,
          sort: 'name',
          sort_dir: 'asc',
          filter: null,
        });

        expect(result1.items).toHaveLength(2);
        expect(result1.items.map(item => item.name)).toEqual(['Action', 'Comedy']);

        const result2 = await repository.search({
          page: 2,
          per_page: 2,
          sort: 'name',
          sort_dir: 'asc',
          filter: null,
        });

        expect(result2.items).toHaveLength(2);
        expect(result2.items.map(item => item.name)).toEqual(['Drama', 'Horror']);
      });

      test('should search with filter and sort', async () => {
        const result = await repository.search({
          page: 1,
          per_page: 10,
          sort: 'name',
          sort_dir: 'desc',
          filter: 'o',
        });

        expect(result.items).toHaveLength(3);
        expect(result.items.map(item => item.name)).toEqual(['Horror', 'Comedy', 'Action']);
      });
    });
})