import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }

}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}
describe('Value Objects unit tests', () => {
  test('should be equals', () => {
    const valueObject1 = new StringValueObject('value');
    const valueObject2 = new StringValueObject('value');
    expect(valueObject1.equals(valueObject2)).toBeTruthy();
  });

  test('should not be equals when values are different types', () => {
    const valueObject1 = new StringValueObject('value');
    const valueObject2 = new StringValueObject('value2', );
    expect(valueObject1.equals(valueObject2)).toBeFalsy();

    const complexValueObject1 = new ComplexValueObject('value', 1);
    const complexValueObject2 = new ComplexValueObject('value', 2);
    expect(complexValueObject1.equals(complexValueObject2)).toBeFalsy();
  });

})