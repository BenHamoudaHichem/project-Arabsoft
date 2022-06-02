import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
export class DateValidation {
  static isBefor( date_now: Date) :ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const formGroup = abstractControl as FormGroup;
      if (moment(formGroup.value,'yyyy-MM-DD').toDate().getTime()<moment(date_now).toDate().getTime()) {
        return { DateConfirmation: true };}

      return null;
    };
  }

  static isAfter( date_now: Date) :ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const formGroup = abstractControl as FormGroup;
      if (moment(formGroup.value,'yyyy-MM-DD').toDate().getTime()>moment(date_now).toDate().getTime()) {
        return { DateConfirmation: true };}

      return null;
    };
  }
}
