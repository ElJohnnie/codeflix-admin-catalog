import { EntityValidationError } from "../../../../../@shared/domain/validators/validation.error";
import { setupSequelize } from "../../../../../@shared/infra/testing/helpers";
import { CategoryModelMapper } from "../category-model-mapper";
import { CategoryModel } from "../category.model";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({
        models: [CategoryModel],
      })

  
it("should throws error when category is invalid", () => {
  const model = CategoryModel.build({
    category_id: "c3b7f9f6-0b43-4f1e-a3b3-72c469af8d68",
  })
  try {
    CategoryModelMapper.toEntity(model);
    fail("Should throw an error");
  } catch (error) {
    expect(error).toBeInstanceOf(EntityValidationError);
    expect((error as EntityValidationError).error).toMatchObject(
        {
          name: [
            "name should not be empty", 
            "name must be a string", 
            "name must be shorter than or equal to 255 characters"
          ],
        },
      );
  }
})
  

  

  
});
