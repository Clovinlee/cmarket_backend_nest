import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'minimalUppercase', async: false })
export class MinimalUppercaseValidator implements ValidatorConstraintInterface {
  validate(text: string = "", args: ValidationArguments) {
    const requiredCount = args.constraints[0]; 
    const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
    return uppercaseCount >= requiredCount; 
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must contain at least ${args.constraints[0]} uppercase letters`;
  }
}
