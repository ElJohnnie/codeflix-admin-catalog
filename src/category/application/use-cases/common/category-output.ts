import { Category } from "../../../domain/category.entity";

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { category_id, ...otherProps} = entity.toJson();

    return {
      id: entity.category_id.id,
      name: otherProps.name,
      description: otherProps.description ?? null,
      is_active: otherProps.is_active,
      created_at: otherProps.created_at
    }
  }
}