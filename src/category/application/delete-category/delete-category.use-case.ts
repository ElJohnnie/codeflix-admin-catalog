import { IUsecase } from "../../../@shared/application/use-case.interface";
import { Uuid } from "../../../@shared/domain/value-objects/uuid.vo";
import { ICategoryRepository } from "../../domain/category.repository";

export class DeleteCategoryUseCase implements IUsecase<DeleteCategoryInput, DeleteCategoryOutput> {

  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const uuid = new Uuid(input.id);
    await this.categoryRepo.delete(uuid);
  }
}

export type DeleteCategoryInput = {
  id: string;
}

export type DeleteCategoryOutput = void;