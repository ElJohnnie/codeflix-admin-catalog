import { validateSync } from "class-validator";
import { FieldsErrors, IValidatorFields } from "./validator-fields.interface";

export abstract class ClassValidatorFields<PropsValidated> implements IValidatorFields<PropsValidated> {
  errors: FieldsErrors | null = null;
  validatedData: PropsValidated | null = null;

  validate(data: any){
    const errors = validateSync(data);
    if(errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        const constraints = error.constraints ? Object.values(error.constraints) : [];
        this.errors[field] = constraints;
      }
    } else {
      this.validatedData = data
    }
    return !errors.length;
  }
}
