import {
  registerDecorator,
  ValidatorConstraint,
  type ValidationOptions,
  type ValidatorConstraintInterface,
  type ValidationArguments,
} from 'class-validator';
import { isAddress } from 'ethers';

export function IsAddress(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyKey: string | symbol) {
    if (typeof propertyKey === 'string') {
      registerDecorator({
        name: 'isAddress',
        target: object.constructor,
        propertyName: propertyKey,
        constraints: [property],
        options: validationOptions,
        validator: IsAddressConstraint,
      });
    }
  };
}

@ValidatorConstraint({ async: false })
class IsAddressConstraint implements ValidatorConstraintInterface {
  validate(input: string, args?: ValidationArguments): boolean {
    return isAddress(input);
  }

  defaultMessage(args?: ValidationArguments): string {
    return '';
  }
}
