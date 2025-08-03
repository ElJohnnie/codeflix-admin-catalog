import { Sequelize } from "sequelize-typescript";
import { NotFoundError } from "../../../../../../@shared/domain/errors/not-found.error";
import { Category } from "../../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "../../update-gategory.use-case";

describe("UpdateCategoryUseCase Integration Tests", () => {
  let sequelize: Sequelize;
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  const setupSequelize = (options: { models: any[] }) => {
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: options.models,
      logging: false,
    });
  };

  beforeAll(async () => {
    sequelize = setupSequelize({
      models: [CategoryModel],
    });
    await sequelize.sync({ force: true });
    
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  beforeEach(async () => {
    await CategoryModel.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should update a category", async () => {
    // Create a category first
    const category = Category.fake().aCategory().build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      name: "Updated Category",
      description: "Updated Description",
      is_active: false,
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: "Updated Category",
      description: "Updated Description",
      is_active: false,
      created_at: category.created_at,
    });

    // Verify category was updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel).not.toBeNull();
    expect(categoryModel!.name).toBe("Updated Category");
    expect(categoryModel!.description).toBe("Updated Description");
    expect(categoryModel!.is_active).toBe(false);
  });

  test("should update only name", async () => {
    // Create a category first
    const category = Category.fake().aCategory().withName("Original Name").withDescription("Original Description").build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      name: "Updated Name Only",
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: "Updated Name Only",
      description: "Original Description",
      is_active: category.is_active,
      created_at: category.created_at,
    });

    // Verify only name was updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.name).toBe("Updated Name Only");
    expect(categoryModel!.description).toBe("Original Description");
    expect(categoryModel!.is_active).toBe(category.is_active);
  });

  test("should update only description", async () => {
    // Create a category first
    const category = Category.fake().aCategory().withName("Original Name").withDescription("Original Description").build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      description: "Updated Description Only",
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: "Original Name",
      description: "Updated Description Only",
      is_active: category.is_active,
      created_at: category.created_at,
    });

    // Verify only description was updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.name).toBe("Original Name");
    expect(categoryModel!.description).toBe("Updated Description Only");
    expect(categoryModel!.is_active).toBe(category.is_active);
  });

  test("should update description to null", async () => {
    // Create a category first
    const category = Category.fake().aCategory().withDescription("Original Description").build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      description: null as string | null,
    };

    const output = await useCase.execute(input);

    expect(output.description).toBeNull();

    // Verify description was set to null in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.description).toBeNull();
  });

  test("should update only is_active to true", async () => {
    // Create an inactive category first
    const category = Category.fake().aCategory().deactivate().build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      is_active: true,
    };

    const output = await useCase.execute(input);

    expect(output.is_active).toBe(true);

    // Verify is_active was updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.is_active).toBe(true);
  });

  test("should update only is_active to false", async () => {
    // Create an active category first
    const category = Category.fake().aCategory().activate().build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      is_active: false,
    };

    const output = await useCase.execute(input);

    expect(output.is_active).toBe(false);

    // Verify is_active was updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.is_active).toBe(false);
  });

  test("should throw error when category not found", async () => {
    const nonExistentId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID format but doesn't exist
    const input = {
      id: nonExistentId,
      name: "Updated Name",
    };

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(input)).rejects.toThrow(`Category Not Found using ID ${nonExistentId}`);
  });


  test("should throw validation error when updating with name too long", async () => {
    // Create a category first
    const category = Category.fake().aCategory().build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      name: "a".repeat(256), // Name too long (more than 255 characters)
    };

    await expect(useCase.execute(input)).rejects.toThrow("Validation Error");

    // Verify category was not updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.name).toBe(category.name); // Should remain original name
  });

  test("should update multiple fields at once", async () => {
    // Create a category first
    const category = Category.fake().aCategory().withName("Original").withDescription("Original Desc").activate().build() as Category;
    await repository.insert(category);

    const input = {
      id: category.category_id.id,
      name: "All Updated",
      description: "All Updated Description",
      is_active: false,
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: "All Updated",
      description: "All Updated Description",
      is_active: false,
      created_at: category.created_at,
    });

    // Verify all fields were updated in database
    const categoryModel = await CategoryModel.findByPk(category.category_id.id);
    expect(categoryModel!.name).toBe("All Updated");
    expect(categoryModel!.description).toBe("All Updated Description");
    expect(categoryModel!.is_active).toBe(false);
  });
});
