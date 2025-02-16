import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { LottieAnimationComponent } from 'src/app/pages/ui-components/lottie-animation/lottie-animation.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
/**
 * Top action configuration
 * @param icon: A string for icon
 * @param shape: A string representing buttons shape
 * @param function: A function to trigger when button is pressed
 * @param disabled: (Optional) A boolean to lock button
 * @param color: (Optional) An enum representing color
 * @param label: (Optional) A string to display as label
 * @param tooltip: (Optional) A string to display when hovered
 */
export interface TopAction<T> {
  icon:string,
  function: ()=>void
  color?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast',
  label?:string,
  tooltip?:string;
}
/**
 * Row action configuration
 * @param icon: A string for icon
 * @param shape: A string representing buttons shape
 * @param function: A function to trigger when button is pressed
 * @param disabled: (Optional) A boolean to lock button
 * @param color: (Optional) An enum representing color
 * @param label: (Optional) A string to display as label
 * @param tooltip: (Optional) A string to display when hovered
 */
export interface RowAction<T> {
  icon:string,
  shape:'rounded'|'default',
  function?: (event:Event,args:T)=>void
  disabled?:boolean,
  color?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast',
  label?:string,
  tooltip?:string;
}
/**
 * Step configuration
 * @param id : A string representing the filter value for  datarows
 * @param label: A string to display as step label
 * @param actions: List of RowAction per step
 * @param tooltip: (Optional) A string to display when hovered
 * @param icon: (Optional) A string for icon
 * @param function: (Optional) Custom function to call when pressed
 */
export interface Step<T, K extends keyof T>{
  id:T[K],
  label:string,
  actions?: RowAction<T>[]
  tooltip?:string,
  icon?:string,
  function?:(event:Event,id:T[K])=>void
}
/**
 * Contains Data for Progress Table
 * 
 * Usage (TS):
 * ```ts
 * this.config:ProgressTableData<User,'verified'> = {
 *  title: 'My Table',
 *  description: 'This is an example table',
 *  columns: {
 *    'name' : 'Name',
 *    'id'   : 'User ID'
 *  },
 *  activeStep: 0,
 *  stepField: 'verified',
 *  steps: [
 *    id:'unverified',
 *    label:'Unverified',
 *    actions: [
 *      {
 *        icon: 'pi pi-spinner pi-spin',
 *        shape: 'default',
 *        label: 'Waiting...',
 *        disabled: true,
 *      }
 *    ]
 *    
 *  ],
 *  data: this.data,
 * }
 * // Additional data processing
 * this.config.dataLoaded = true
 * ```
 * @param title: A string representing table name
 * @param description: A string representing table description
 * @param columns: A map of strings to map real fields to names
 * @param activeStep: A number representing default step
 * @param stepField: A key representing the field to filter
 * @param steps: An array of step configurations
 * @param data: an array of data to display
 * @param searchFields: (Optional) an array of keys to filter using search
 * @param dataLoaded: (Defaults false) a boolean to toggle loading indicator on table
 * Usage (HTML)
 * ```html
 * <app-progress-table [config]="config" />
 * ```
 * 
 */
export interface ProgressTableData<T, K extends keyof T>{
  title:string,
  description:string,
  columns: {[K in keyof Partial<T>]:string},
  activeStep:number,
  stepField:K,
  steps: [Step<T, K>, Step<T, K>] | [Step<T, K>, Step<T, K>, Step<T, K>];
  data: T[],
  topAction?:TopAction<T>,
  searchFields?:(keyof T)[],
  dataLoaded?:boolean,
}


@Component({
  selector: 'app-progress-table',
  standalone: true,
  imports: [
    CommonModule,FormsModule,MaterialModule,
    LottieAnimationComponent,ButtonModule,IconFieldModule,InputIcon,InputTextModule,StepperModule,TableModule,ToastModule,FluidModule,TooltipModule,DialogModule,ConfirmPopupModule],
  providers:[MessageService,ConfirmationService],
  templateUrl: './progress-table.component.html',
  styleUrl: './progress-table.component.scss'
})
export class ProgressTableComponent<T,K extends keyof T> {
  @Input() config:ProgressTableData<T,K>;

  searchValue:string='';

  getColumnNames():string[]{
    if(this.config){
      const table_names = Object.values(this.config.columns) as string[];
      return table_names;
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  getRowId(row:T): T[keyof T]{
    return row['id' as keyof T];
  }

  getFieldNames(): string[]{
    if(this.config){
      if(this.config.searchFields){
        return this.config.searchFields as string[];
      }
      const table_names = Object.keys(this.config.columns);
      return table_names;
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  hasActions(){
    if(this.config){
      const step = this.config.steps[this.config.activeStep]
      return  step.actions?.length
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  getFields(): (keyof T)[]{
    if(this.config){
      const table_names = Object.keys(this.config.columns)  as  (keyof T)[];
      return table_names;
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  isActiveStep(stepId:T[K]){
    if(this.config){
      return this.config.activeStep == this.config.steps.findIndex(s=>s.id == stepId);
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  filteredData():T[]{
    if(this.config){
      const steps = this.config.steps;
      return this.config.data.filter(d=>d[this.config.stepField as keyof T] == steps[this.config.activeStep].id);
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

  nextStep(){
    if(this.config){
      this.config.activeStep++;
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }
  prevStep(){
    if(this.config){
      this.config.activeStep--;
    }else{
      throw new Error('Progress Table config has not been loaded')
    }
  }

}
