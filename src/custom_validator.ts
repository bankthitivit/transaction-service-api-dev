import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import * as moment from 'moment';
@ValidatorConstraint({ name: 'NearNow', async: false })
export class NearNow implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    const time_now = moment().utcOffset('+0700');
    const test = moment(time)
    return time_now.diff(time) <= 60000 * 30 ? true : false; // for async validations you must return a Promise<boolean> here
  }
}



@ValidatorConstraint({ name: 'IsPrice', async: false })
export class IsPrice implements ValidatorConstraintInterface {
  validate(amount: string, args: ValidationArguments) {

    let amount_cent: any = Math.round(parseFloat(amount) * 100);


    return (amount_cent > 0 && amount_cent < 1000000) ? true : false;
  }
}