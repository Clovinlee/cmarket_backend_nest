import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'sameValueAs', async: false })
export class SameValueAsValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const otherPropertyName = args.constraints[0]; // Get the name of the other property to compare with
    const otherValue = (args.object as any)[otherPropertyName]; // Get the value of the other property
    return value === otherValue; // Check if the values are the same
  }

  defaultMessage(args: ValidationArguments) {
    const otherPropertyName = args.constraints[0];
    return `${args.property} must have the same value as ${otherPropertyName}`;
  }
}