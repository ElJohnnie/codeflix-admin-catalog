import { InvalidUuidError } from "../../../../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUsecase } from "../../get-category.use-case";

describe('GetCategoryUsecase', () => {
  let useCase: GetCategoryUsecase;
  let categoryRepo: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepo = new CategoryInMemoryRepository();
    useCase = new GetCategoryUsecase(categoryRepo);
  });


  it('should throws en error if category not found', async () => {
    await expect(useCase.execute({ id: 'invalid-id' })).rejects.toThrow(new InvalidUuidError());
  });

  it('should delete a category', async () => {
   const items = [new Category({ name: "test 1"})]
   categoryRepo.items = items;

    await useCase.execute({ id: items[0].category_id.id });
    
    expect(categoryRepo.items).toHaveLength(1);
  });
});