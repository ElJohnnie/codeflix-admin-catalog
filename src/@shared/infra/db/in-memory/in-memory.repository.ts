import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IRepository } from "../../../domain/repository/repository-interface";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> 
implements IRepository<E, EntityId> {
  items: E[] = [];
  async insert(entity: E): Promise<void> {
   this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async findById(entity_id: EntityId): Promise<E> {
    return this._get(entity_id);
  }
  async findAll(): Promise<E[]> {
   return this.items;
  }
  async update(entity: E): Promise<void> {
     const index = this.items.findIndex(item => item.entity_id.equals(entity.entity_id));
      if (index !== -1) {
        this.items[index] = entity;
      } else {
        throw new NotFoundError(entity.entity_id, this.getEntity());
      }
  }
  async delete(entity_id: EntityId): Promise<void> {
    const index = this.items.findIndex(item => item.entity_id.equals(entity_id));
    if (index !== -1) {
      this.items.splice(index, 1);
    } else {
      throw new NotFoundError(entity_id, this.getEntity());
    }
  }

  protected _get(entity_id: EntityId): E | null {
    return this.items.find(item => item.entity_id.equals(entity_id)) || null;
  }

  abstract getEntity(): new (...args: any[]) => E

}