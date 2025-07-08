import { Uuid } from "../../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../category-in-memory.repository";

describe('CategoryInMemoryRepository', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  function makeCategory(props?: Partial<Category>) {
    return new Category({
      name: props?.name ?? 'Test',
      description: props?.description ?? null,
      is_active: props?.is_active ?? true,
      created_at: props?.created_at ?? new Date(),
      category_id: props?.category_id ?? new Uuid(),
    } as any);
  }


  it('should return all items if filter is empty', async () => {
    const items = [makeCategory({ name: 'A' }), makeCategory({ name: 'B' })];
    repository.items = items;
    const filtered = await repository["applyFilter"](items, '');
    expect(filtered).toEqual(items);
  });

  it('should sort by name ascending', () => {
    const date = new Date();
    const items = [
      makeCategory({ name: 'C', created_at: date }),
      makeCategory({ name: 'A', created_at: date }),
      makeCategory({ name: 'B', created_at: date }),
    ];
    const sorted = repository["applySort"]([...items], 'name', 'asc');
    expect(sorted.map(i => i.name)).toEqual(['A', 'B', 'C']);
  });

  it('should sort by name descending', () => {
    const date = new Date();
    const items = [
      makeCategory({ name: 'C', created_at: date }),
      makeCategory({ name: 'A', created_at: date }),
      makeCategory({ name: 'B', created_at: date }),
    ];
    const sorted = repository["applySort"]([...items], 'name', 'desc');
    expect(sorted.map(i => i.name)).toEqual(['C', 'B', 'A']);
  });

  it('should sort by created_at desc by default', () => {
    const items = [
      makeCategory({ name: 'A', created_at: new Date('2023-01-01') }),
      makeCategory({ name: 'B', created_at: new Date('2023-01-03') }),
      makeCategory({ name: 'C', created_at: new Date('2023-01-02') }),
    ];
    const sorted = repository["applySort"]([...items], null, null);
    expect(sorted.map(i => i.name)).toEqual(['B', 'C', 'A']);
  });
});