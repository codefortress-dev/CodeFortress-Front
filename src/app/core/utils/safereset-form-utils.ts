import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

export function safeReset(form: FormGroup, wasSuccessful: boolean): void {
  if (!wasSuccessful) return;

  function resetControls(group: FormGroup) {
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        control.setValue('');
        control.markAsPristine();      // ✅ limpia estado visual
        control.markAsUntouched();    // ✅ oculta errores como "campo obligatorio"
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        resetControls(control); // ✅ soporte para anidados
      }
    });
  }

  resetControls(form);

  // También al form root
  form.markAsPristine();
  form.markAsUntouched();
  form.updateValueAndValidity();
}