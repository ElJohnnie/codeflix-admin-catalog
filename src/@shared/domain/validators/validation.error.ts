import { FieldsErrors } from "./validator-fields.interface";
import ValidatorRules from './validator-rules';

export class ValidationError extends Error {};

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors, message = "Validation Error") {
    super(message);
    this.name = 'EntityValidationError';
  }

  count() {
    return Object.keys(this.error).length;
  }
}