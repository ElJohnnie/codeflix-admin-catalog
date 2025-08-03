import { NotFoundError } from "../../../../../../@shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../../update-gategory.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throw InvalidUuidError when ID is invalid", async () => {
    await expect(useCase.execute({ id: "fake id", name: "fake name" }))
      .rejects.toThrow(InvalidUuidError);
  });

  it("should throw NotFoundError when entity not found", async () => {
    const uuid = new Uuid();

    await expect(useCase.execute({ id: uuid.id, name: "fake name" }))
      .rejects.toThrow(NotFoundError);
  });

  it("should update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie"});

    repository.items = [entity]

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "Updated Name",
    })
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: "Updated Name",
      description: null,
      is_active: true,
      created_at: entity.created_at, 
    })
  });
});
