import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Use standalone-compatible directives
    InputTextModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './create-plan.component.html',
  styleUrl: './create-plan.component.scss',
})
export class CreatePlanComponent {
  planForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.planForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      estimatedCost: ['', [Validators.required, Validators.min(0)]],
      justification: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.planForm.valid) {
      console.log('Plan Submitted:', this.planForm.value);
      this.router.navigate(['/dashboard']);
    }
  }
}