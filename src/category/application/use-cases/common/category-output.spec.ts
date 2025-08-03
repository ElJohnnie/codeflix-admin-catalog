import { Category } from "../../../domain/category.entity";
import { CategoryOutputMapper } from "./category-output";

describe("CategoryOutputMapper", () => {
  it("should convert a categoty in a output", () => {
    const entity = Category.create({
      name: "Movie",
      description: "Some description",
      is_active: true,
    });
    const spyToJson = jest.spyOn(entity, "toJson");
    const output = CategoryOutputMapper.toOutput(entity)
    expect(spyToJson).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie',
      description: 'Some description',
      is_active: true,
      created_at: entity.created_at,
    })
  });
})
