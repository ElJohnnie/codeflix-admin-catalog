import { NotFoundError } from "../../../../../../@shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../../@shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../../@shared/infra/testing/helpers";
import { Category } from "../../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe('DeleteCategoryUseCase integration test', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel]});
  beforeEach(() => {
    repository  = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it('should delete a category', async () => {
    const entity = new Category({ name: 'test' });
    await repository.insert(entity);

    await useCase.execute({ id: entity.category_id.id });

    const foundEntity = await repository.findById(entity.category_id);
    expect(foundEntity).toBeNull();
  });
});