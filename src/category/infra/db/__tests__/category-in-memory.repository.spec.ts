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
    const items = [Category.fake().theCategories(3).build()];
    repository.items = items;
    const filtered = await repository["applyFilter"](items, '');
    expect(filtered).toEqual(items);
  });

    it('should no filter items when filter object is null', async () => {
    const items = [Category.fake().aCategory().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

    it('should filter items using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

    it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = [
      Category.fake()
        .aCategory()
        .withName('test')
        .withCreatedAt(created_at)
        .build(),
      Category.fake()
        .aCategory()
        .withName('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Category.fake()
        .aCategory()
        .withName('fake')
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

    it('should sort by name', async () => {
    const items = [
      Category.fake().aCategory().withName('c').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('a').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
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