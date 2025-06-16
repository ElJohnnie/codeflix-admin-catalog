import { InvalidUuidError, Uuid } from "../uuid.vo";

describe("Uuid Value Object", () => {

  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");
  it("should create a valid UUID", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuid.id.length).toBe(36);

  });

  it("should accept a valid UUID", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
  });

  it("should throw an error for an invalid UUID", () => {
    const invalidUuid = "invalid-uuid";
    expect(() => new Uuid(invalidUuid)).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should generate a different UUID each time", () => {
    const uuid1 = new Uuid();
    const uuid2 = new Uuid();
    expect(uuid1.id).not.toBe(uuid2.id);
  });
})