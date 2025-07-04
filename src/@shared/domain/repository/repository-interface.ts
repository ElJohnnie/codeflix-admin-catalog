import { Entity } from "../entity";
import { ValueObject } from "../value-object";

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: any): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  findById(entity_id: string): Promise<E | null>;
  findAll(): Promise<E[]>;
  update(entity_id: EntityId): Promise<void>;
  delete(id: string): Promise<void>;

  getEntity(): new (...args: any[]) => E;
}