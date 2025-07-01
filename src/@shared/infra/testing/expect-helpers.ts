import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error.not-use-yet";
import { FieldsErrors } from "../../domain/validators/validator-fields.interface";

type Expected = | {
  validator: ClassValidatorFields<any>;
  data: any
}| (() => {})

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        if (Array.isArray(error.error)) {
          for (const err of error.error) {
            const result = assertContainsErrorsMessages(err, received);
            if (result.pass) {
              return result;
            }
          }
          return {
            pass: false,
            message: () =>
              `None of the validation errors contain ${JSON.stringify(
                received
              )}. Current: ${JSON.stringify(error.error)}`,
          };
        }
        return assertContainsErrorsMessages(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assertContainsErrorsMessages(validator.errors, received);
    }
  },
})

function assertContainsErrorsMessages(
  expected: FieldsErrors,
  received: FieldsErrors
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? isValid()
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      };
}

function isValid() {
  return { pass: true, message: () => "" };
}