import { Uuid } from "../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";
Uuid

describe('Category units tests', () => {
  test('constructor of Category', () => {
    const category = new Category({
      name: 'Movie',
      description: 'A movie category',
      is_active: true,
      created_at: new Date('2023-01-01T00:00:00Z'),
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('A movie category');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toEqual(new Date('2023-01-01T00:00:00Z'));
  });

  test('create method of Category', () => {
    const category = Category.create({
      name: 'Movie',
      description: 'A movie category',
    });

    expect(category.category_id).toBeDefined();
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('A movie category');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test('changeName method of Category', () => {
    const category = new Category({
      name: 'Movie',
    });

    category.changeName('Documentary');
    expect(category.name).toBe('Documentary');
  });

  test('changeDescription method of Category', () => {
    const category = new Category({
      name: 'Movie',
    });

    category.changeDescription('A movie category');
    expect(category.description).toBe('A movie category');

    category.changeDescription(null);
    expect(category.description).toBeNull();
  });
})

describe("category id field tests", () => {
 const arrange = [{category_id: undefined}, {category_id: new Uuid()}];
  test.each(arrange)("id = %j", ({category_id}) => {
    const category = new Category({
      name: 'Movie',
      category_id: category_id as any,
      description: 'A movie category',
      is_active: true,
      created_at: new Date('2023-01-01T00:00:00Z'),
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
  })
})