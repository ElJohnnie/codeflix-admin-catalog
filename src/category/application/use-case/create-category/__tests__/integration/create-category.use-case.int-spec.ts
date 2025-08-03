import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let sequelize: Sequelize;
  let useCase: CreateCategoryUseCase;
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
    useCase = new CreateCategoryUseCase(repository);
  });

  beforeEach(async () => {
    await CategoryModel.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a category", async () => {
    const input = {
      name: "Test Category",
      description: "Test Description",
      is_active: true,
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      name: "Test Category",
      description: "Test Description",
      is_active: true,
      created_at: expect.any(Date),
    });

    // Verify category was persisted in database
    const categoryModel = await CategoryModel.findByPk(output.id);
    expect(categoryModel).not.toBeNull();
    expect(categoryModel!.name).toBe("Test Category");
    expect(categoryModel!.description).toBe("Test Description");
    expect(categoryModel!.is_active).toBe(true);
  });

  test("should create a category with only name", async () => {
    const input = {
      name: "Test Category",
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      name: "Test Category",
      description: null,
      is_active: true,
      created_at: expect.any(Date),
    });

    // Verify category was persisted in database
    const categoryModel = await CategoryModel.findByPk(output.id);
    expect(categoryModel).not.toBeNull();
    expect(categoryModel!.name).toBe("Test Category");
    expect(categoryModel!.description).toBeNull();
    expect(categoryModel!.is_active).toBe(true);
  });

  test("should create a category with null description", async () => {
    const input = {
      name: "Test Category",
      description: null as string | null,
      is_active: false,
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: expect.any(String),
      name: "Test Category",
      description: null,
      is_active: false,
      created_at: expect.any(Date),
    });

    // Verify category was persisted in database
    const categoryModel = await CategoryModel.findByPk(output.id);
    expect(categoryModel).not.toBeNull();
    expect(categoryModel!.name).toBe("Test Category");
    expect(categoryModel!.description).toBeNull();
    expect(categoryModel!.is_active).toBe(false);
  });

  test("should throw error when name is invalid", async () => {
    const input = {
      name: "",
      description: "Test Description",
      is_active: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow("Validation Error");

    // Verify no category was persisted in database
    const categories = await CategoryModel.findAll();
    expect(categories).toHaveLength(0);
  });

  test("should throw error when name is too long", async () => {
    const input = {
      name: "a".repeat(256), // More than 255 characters
      description: "Test Description",
      is_active: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow("Validation Error");

    // Verify no category was persisted in database
    const categories = await CategoryModel.findAll();
    expect(categories).toHaveLength(0);
  });

  test("should create multiple categories", async () => {
    const input1 = {
      name: "Category 1",
      description: "Description 1",
      is_active: true,
    };

    const input2 = {
      name: "Category 2",
      description: "Description 2",
      is_active: false,
    };

    const output1 = await useCase.execute(input1);
    const output2 = await useCase.execute(input2);

    expect(output1.id).not.toBe(output2.id);
    expect(output1.name).toBe("Category 1");
    expect(output2.name).toBe("Category 2");

    // Verify both categories were persisted in database
    const categories = await CategoryModel.findAll();
    expect(categories).toHaveLength(2);
  });

  test("should handle database constraints", async () => {
    const input = {
      name: "Test Category",
      description: "Test Description",
      is_active: true,
    };

    // Create first category
    const output1 = await useCase.execute(input);
    expect(output1.id).toBeDefined();

    // Create second category with same name (should work since there's no unique constraint on name)
    const output2 = await useCase.execute(input);
    expect(output2.id).toBeDefined();
    expect(output2.id).not.toBe(output1.id);

    // Verify both categories were persisted
    const categories = await CategoryModel.findAll();
    expect(categories).toHaveLength(2);
  });
});
