import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
export class DateValidation {
  static DateConfirmation(control: string, date_now: Date) {
    return (formGroup: FormGroup) => {

    let selectedDate = moment(formGroup.controls[control].value);
 
    if (selectedDate.isBefore(date_now) ) {
      return { DateConfirmation: true };
    }
    return null;
  }
}}
