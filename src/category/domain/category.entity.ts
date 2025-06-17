import { Uuid } from "../../@shared/domain/value-objects/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
  category_id?: Uuid | string;
  name: string;
  description?: string | null; 
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryCreateCommand = Omit<CategoryConstructorProps, 'category_id' | 'created_at'>;

export class Category {
  category_id: Uuid;
  name: string;
  description: string | null; 
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    this.category_id = typeof props.category_id === "string"
      ? new Uuid(props.category_id)
      : props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CategoryCreateCommand): Category {
    return new Category(props);
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  active(): void {
    this.is_active = true;
  }

  deactive(): void {
    this.is_active = false;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(entity);
  }

  toJson(): CategoryConstructorProps {
    return {
      category_id: this.category_id.id || this.category_id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at
    };
  }

}