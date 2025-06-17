import { FormGroup, FormControl, AbstractControl } from '@angular/forms';


export function safeReset(form: FormGroup): void {
  const resetRecursively = (control: AbstractControl) => {
    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(resetRecursively);
    } else if (control instanceof FormControl) {
      control.reset('');
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity({ onlySelf: true });
    }
  };

  resetRecursively(form);
  form.markAsPristine();
  form.markAsUntouched();
  form.updateValueAndValidity();

  // 🔁 Eliminar residuos visuales de Angular Material
  setTimeout(() => {
    document.querySelectorAll('.mat-form-field-invalid').forEach(el => {
      el.classList.remove('mat-form-field-invalid');
    });
  }, 0);
}