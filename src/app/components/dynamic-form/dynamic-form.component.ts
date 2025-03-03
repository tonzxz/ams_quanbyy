import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validator, ValidatorFn, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Validation {
  validator: ValidatorFn,
  message:string
}

interface FieldOption {
  value:string;
  label:string;
}

interface ButtonDecoration {
  label:string;
  icon:string;
}

interface FormField <T> {
  id: keyof T;
  label:string;
  placeholder:string;
  validators:Validation[],
  type: 'input'| 'date'| 'currency'| 'number' | 'otp' | 'file' | 'select' | 'textarea'
  options?: FieldOption[],
}

export interface DynamicFormData <T> {
  title:string;
  description:string;
  data: T;
  formfields: FormField<T>[],
  submit:(value:T) => void;
  columns?: number,
  show?:boolean;
  cancelDecoration?:ButtonDecoration;
  submitDecoration?:ButtonDecoration;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    InputMaskModule,
    FileUploadModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    ToastModule,
  ],
  providers:[MessageService],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent<T> implements OnInit {
  @Input() config: DynamicFormData<T>;
  form: FormGroup;
  constructor(private messageService:MessageService){}
  ngOnInit(){
    this.form = new FormGroup({})
    this.config.formfields.forEach(field => {
      if(this.config.data[field.id]){
        if(field.type == 'select'){
          const selected = field.options?.find(s=>s.value ==this.config.data[field.id])
          const control =  new FormControl(selected!, [...field.validators.map(v=>v.validator)]);
          this.form.addControl(field.id.toString(), control);
        }else{
          const control =  new FormControl(this.config.data[field.id], [...field.validators.map(v=>v.validator)]);
          this.form.addControl(field.id.toString(), control);
        }
      }else{
        const control =  new FormControl('', [...field.validators.map(v=>v.validator)]);
        this.form.addControl(field.id.toString(), control);
      }
    });
  }

  isRequired(field:FormField<T>){
    return field.validators?.some(validator => validator.validator.name === 'required')
  }
  
  onSubmit(){
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach(controlName => {
        this.form.controls[controlName].markAsTouched();
      });
      this.messageService.add({ severity: 'error', summary: 'Form is invalid!', detail: `Please check your form is its valid.` });
      return;
    }
    const value = this.form.value;
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const field = value[key];
        if (field && typeof field === 'object' && 'value' in field && 'label' in field) {
          value[key] = field.value;
        }
      }
    }
    this.config.submit(
      {
        ...this.config.data,
        ...value
      }
    );
    this.config.show = false;
  }

}
