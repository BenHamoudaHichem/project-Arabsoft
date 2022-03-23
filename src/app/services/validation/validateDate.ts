import { FormGroup } from "@angular/forms";


export class ConfirmDate {
  static ConfirmedDate(startedAt: string, dateDeclaration: Date) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[startedAt];
      if (
        control?.value >= dateDeclaration
      ) {
        console.log('validé');
        return;
      } else {
        control?.setErrors({ incorrect: true });
      }
      control?.setErrors(null);
    };
  }
}
