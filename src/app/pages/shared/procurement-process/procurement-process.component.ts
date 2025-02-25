import { Component, OnInit } from '@angular/core';
import { MultiTableComponent, MultiTableData } from 'src/app/components/multi-table/multi-table.component';
import { ProcurementMode, ProcurementProcess } from 'src/app/schema/schema';
import { CrudService } from 'src/app/services/crud.service';
import {DividerModule} from 'primeng/divider'
import { DynamicFormComponent, DynamicFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-procurement-process',
  standalone: true,
  imports: [MultiTableComponent, DividerModule,DynamicFormComponent],
  templateUrl: './procurement-process.component.html',
  styleUrl: './procurement-process.component.scss'
})
export class ProcurementProcessComponent implements OnInit {

  selectedMode:ProcurementMode;
  selectedProcess:ProcurementProcess;

  procurementMethod: MultiTableData<ProcurementMode> = {
    title: 'Procurement Mode',
    description: 'View and manage the procurement mode.',
    type: 'default',
    columns: {
      mode_name: 'Mode',
      method: 'Method'
    },
    data: [],
    searchFields: ['mode_name','method'],
    topActions: [
      {
        label: 'Add Method',
        icon: 'pi pi-plus',
        function: async  () => {
          // TODO: Implement adding new procurement process
          this.modeForm.title = 'Add Procurement Method';
          this.modeForm.description = 'Add new procurement method.';
          this.modeForm.show = true;
        }
      }
    ],
    rowActions : [
      {
        shape: 'rounded',
        label: 'Edit Process',
        icon: 'pi pi-pencil',
        function: async (event:Event,process: ProcurementMode) => {
          // TODO: Implement editing procurement process
          this.modeForm.title = 'Edit Procurement Method';
          this.modeForm.description = 'Edit exisiting procurement method.';
          this.modeForm.data = process,
          this.modeForm.show = true;
        }
      },
      {
        shape: 'rounded',
        label: 'Delete Process',
        icon: 'pi pi-trash',
        color:'danger',
        function: async (event:Event, process: ProcurementMode) => {
          this.procurementMethod.dataLoaded = false;
          // TODO: Implement deleting procurement process
          await this.crudService.delete(ProcurementMode, process.id)
          await this.loadData();
          this.procurementMethod.dataLoaded = true;
        }
      }
    ]
  }
  procurementProcess: MultiTableData<ProcurementProcess, 'procurement_mode_id'> = {
    title: 'Procurement Process',
    description: 'View and manage the procurement process.',
    type: 'sequence',
    columns: { 
      name: 'Name',
    },
    data: [],
    tabField: 'procurement_mode_id', 
    tabs:[
      {
        id:'Public',
        label:'Public'
      },
      {
        id:'Alternative',
        label:'Alternative'
      },
    ],
    activeTab: 0,
    searchFields: ['name'],
    topActions: [
      {
        label: 'Add Process',
        icon: 'pi pi-plus',
        function: async () => {
          // TODO: Implement adding new procurement process
          this.processForm.show = true;
        }
      }
    ],
    rowActions : [
      {
        shape: 'rounded',
        label: 'Edit Process',
        icon: 'pi pi-pencil',
        function: async (event:Event,process: ProcurementProcess) => {
          this.processForm.title = 'Add Procurement Process';
          this.processForm.description = 'Add new procurement process';
          this.processForm.data = process;
          this.processForm.show = true;
        }
      },
      {
        shape: 'rounded',
        label: 'Delete Process',
        icon: 'pi pi-trash',
        color:'danger',
        function: async(event:Event, process: ProcurementProcess) => {
          // TODO: Implement deleting procurement process
          this.procurementProcess.dataLoaded = false;
          await this.crudService.delete(ProcurementProcess, process.id)
          await this.loadData();
          this.procurementProcess.dataLoaded = true;
        }
      }
    ],
    dragEvent: async (event)=>{
      this.procurementProcess.dataLoaded = false;
      const process_1 = this.procurementProcess.data[event.dragIndex!]
      const process_2 = this.procurementProcess.data[event.dropIndex!]

      await this.crudService.partial_update(ProcurementProcess, process_1.id,{
        process_order: process_2.process_order,
      })
      await this.crudService.partial_update(ProcurementProcess, process_2.id,{
        process_order: process_1.process_order,
      })
      await this.loadData();
      this.procurementProcess.dataLoaded = true;
      
    }
  }

  modeForm: DynamicFormData<Partial<ProcurementMode>>;
  processForm: DynamicFormData<Partial<ProcurementProcess>>;

  constructor(private crudService:CrudService){}

  ngOnInit(): void {
    this.loadData();
  }
  async loadData(){   
    this.procurementMethod.data = await this.crudService.getAll(ProcurementMode);
    this.procurementProcess.data = await this.crudService.getAll(ProcurementProcess);

    this.modeForm ={
      show: false,
      title: "Add Procurement Mode",
      description: "Add new procurement mode",
      data: {},
      submit: async (value)=>{
        this.procurementMethod.dataLoaded = false;
        if(value.id){
          await this.crudService.partial_update(ProcurementMode,value.id,value as Omit<ProcurementMode,'id'>) // await this.loadData();
        }else{
          await this.crudService.create(ProcurementMode, value as Omit<ProcurementMode,'id'>) // await this.loadData();
        }
        this.loadData();
        this.procurementMethod.dataLoaded = true;
      },
      formfields: [
        {
          id: 'method',
          label: 'Method',
          placeholder: 'Select method',
          type: 'select',
          options: [
            {
              'label': 'Public',
              'value': 'Public'
            },
            {
              'label': 'Alternative',
              'value': 'Alternative'
            },
          ],
          validators: [
            {
              'message':'Method type is required.',
              'validator': Validators.required,
            }
          ]
        },
        {
          id: 'mode_name',
          label: 'Mode Name',
          placeholder: 'Input Mode Name',
          type: 'input',
          validators: [
            {
              'message':'Mode name is required.',
              'validator': Validators.required,
            }
          ]
        },
      ]
    }

    this.processForm = {
      show: false,
      title: "Add Procurement Process",
      description: "Add new procurement process",
      data: {},
      submit: async (value)=>{
        this.procurementProcess.dataLoaded = false;
        if(value.id){
          await this.crudService.partial_update(ProcurementProcess,value.id,value as Omit<ProcurementProcess,'id'>) // await this.loadData();
        }else{
          await this.crudService.create(ProcurementProcess, {
            ...value as Omit<ProcurementProcess,'id'>,
            procurement_mode_id: this.procurementProcess.tabs?.[this.procurementProcess.activeTab!].id!,
            process_order: this.procurementProcess.data.length + 1
          }) // await this.loadData();
        }
        this.loadData();
        this.procurementProcess.dataLoaded = true;
      },
      formfields:[
        {
          'id':'name',
          'label':'Process Name',
          'placeholder':'Enter Process Name',
          'type':'input',
          'validators':[
            {
              'message':'Process Name is required',
              'validator':Validators.required
            }
          ]
        }
      ]
    }

    this.procurementProcess.data =  this.procurementProcess.data.sort((a,b)=> a.process_order - b.process_order);
    this.procurementMethod.dataLoaded = true;
    this.procurementProcess.dataLoaded = true;
  }
}
