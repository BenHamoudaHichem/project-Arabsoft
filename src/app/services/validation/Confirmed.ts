import { FormGroup } from "@angular/forms";

export class Confirmed {

static ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl?.errors && !matchingControl.hasError("confirmedValidator")) {
          return;
      }
      if (control?.value !== matchingControl?.value) {
          matchingControl?.setErrors({ confirmedValidator: true });
      } else {
          matchingControl?.setErrors(null);
      }
  }
}
}
