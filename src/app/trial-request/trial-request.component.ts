import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { safeReset } from '../core/utils/safereset-form-utils'; // Adjust the import path as necessary

@Component({
  selector: 'app-trial-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './trial-request.component.html',
  styleUrls: ['./trial-request.component.scss']
})
export class TrialRequestComponent implements OnInit {
  trialForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.trialForm = this.fb.group({
    email: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/) // exige dominio válido
      ],
      updateOn: 'change'
    })
  });
}


  submit() {
  if (this.trialForm.invalid) return;

  this.http.get<{ status: string }>('/mock-data/trial-request.json').subscribe({
   next: (res) => {
    const success = res.status === 'ok';
    const message = this.translate.instant('trial.successMessage');
    this.snackBar.open(message, '', { duration: 4000 });
    safeReset(this.trialForm);
  },
  error: (err) => {
    const message = this.translate.instant('trial.errorMessage');
    this.snackBar.open(message, '', { duration: 4000 });
    safeReset(this.trialForm);
  }
  });
  }
}