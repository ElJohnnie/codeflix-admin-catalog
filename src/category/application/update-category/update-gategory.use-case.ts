import { IUsecase } from "../../../@shared/application/use-case.interface";
import { NotFoundError } from "../../../@shared/domain/errors/not-found.error";
import { Uuid } from "../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";

export class UpdateCategoryUseCase implements IUsecase<UpdateCategoryInput, UpdateCategoryOutput> {

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if(!category) {
      throw new NotFoundError(input.id, Category)
    }

    input.name && category.changeName(input.name);

    if ("description" in input) {
      category.changeDescription(input.description);
    }

    if (input.is_active === true) category.active();
    
    if (input.is_active === false) category.deactive();
    
    await this.categoryRepo.update(category); 
    
    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    };
  }
}

export type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

export type UpdateCategoryOutput = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
}