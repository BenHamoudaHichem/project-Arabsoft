import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
export class DateValidation {
  static DateConfirmation(control: string, date_now: Date) {
    return (formGroup: FormGroup) => {
      let selectedDate = moment(formGroup.controls[control].value);
      if (selectedDate.isBefore(date_now)) {return { DateConfirmation: true };}
      return null;
    };
  }

  static endDateConfirmation(control: string, date_begin: string) {
    return (formGroup: FormGroup) => {
      let selectedDate = moment(formGroup.controls[control].value);
      if (selectedDate.isBefore(moment(formGroup.controls[date_begin].value))) {return { DateConfirmation: true };}
      return null;
    };
  }
}
