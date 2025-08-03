import { CategoryInMemoryRepository } from "../../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  test("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const input = {
      name: "Test Category",
      description: "Test Description",
      is_active: true,
    };

    const output = await useCase.execute(input);

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].category_id.id,
      name: "Test Category",
      description: "Test Description",
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });

  test("should create a category with only name", async () => {
    const input = {
      name: "Test Category",
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: repository.items[0].category_id.id,
      name: "Test Category",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
  });

  test("should create a category with null description", async () => {
    const input = {
      name: "Test Category",
      description: null as string | null,
      is_active: false,
    };

    const output = await useCase.execute(input);

    expect(output).toStrictEqual({
      id: repository.items[0].category_id.id,
      name: "Test Category",
      description: null,
      is_active: false,
      created_at: repository.items[0].created_at,
    });
  });

  test("should throw error when name is invalid", async () => {
    const input = {
      name: "",
      description: "Test Description",
      is_active: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow("Validation Error");
  });

  test("should throw error when name is too long", async () => {
    const input = {
      name: "a".repeat(256), // More than 255 characters
      description: "Test Description",
      is_active: true,
    };

    await expect(useCase.execute(input)).rejects.toThrow("Validation Error");
  });
});
