import { EntityValidationError } from "../../../@shared/domain/validators/validation.error";
import { Uuid } from "../../../@shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe('Category units tests', () => {
  let validateSpy: jest.SpyInstance;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  });
  describe("Create command", () => {

    test('constructor of Category', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'A movie category',
        is_active: true,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('A movie category');
      expect(category.is_active).toBe(true);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  })

  test('changeName method of Category', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeName('Documentary');
    expect(category.name).toBe('Documentary');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('changeDescription method of Category', () => {
    const category = new Category({
      name: 'Movie',
    });

    category.changeDescription('A movie category');
    expect(category.description).toBe('A movie category');

    category.changeDescription(null);
    expect(category.description).toBeNull();
    expect(validateSpy).toHaveBeenCalledTimes(2);
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

describe("Category validator tests", () => {
  describe("Create command", () => {
    test('should throw error when name is empty', () => {
      expect(() => {
        Category.create({
          name: null,
          description: 'A movie category',
          is_active: true,
        });
      }).toThrow(
        new EntityValidationError({
          name: ['Name is required'],
        })

      )
    });
  })

  });