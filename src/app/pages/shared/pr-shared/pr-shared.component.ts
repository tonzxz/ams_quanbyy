import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MultiTableComponent, MultiTableData } from 'src/app/components/multi-table/multi-table.component';
import { Approvals, Approver, Office, PPMP, PPMPItem, PPMPProject, PurchaseRequest, Users } from 'src/app/schema/schema';
import { CrudService } from 'src/app/services/crud.service';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { UserService } from 'src/app/services/user.service';
import { ProgressTableComponent, ProgressTableData } from 'src/app/components/progress-table/progress-table.component';

interface PurchaseRequestJoin  extends PurchaseRequest {
  office:string;
  totalAmount:number;
}
@Component({
  selector: 'app-pr-shared',
  templateUrl: './pr-shared.component.html',
  styleUrls: ['./pr-shared.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ProgressTableComponent,
    DynamicFormComponent,
  ],
  providers: [CurrencyPipe, DatePipe]
})
export class PrSharedComponent implements OnInit {

  user?:Users;

  constructor(
    private crudService: CrudService,
    private router: Router,
    private userService:UserService,
    private currencyPipe:CurrencyPipe,
    private datePipe:DatePipe,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(value: number): string {
    return '₱ ' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  viewRequest(request: PurchaseRequest) {
    this.router.navigate(['/inspection/purchase-request'], { 
      queryParams: { 
        prNo: request.id,
        view: 'true'
      }
    });
  }




  prRequests: ProgressTableData<PurchaseRequestJoin, 'status'> = {
        title: 'Purchase Requests',
        description: 'Create, view and track purchase requests in this section.',
        columns: { 
          id: 'PR No.',
          office: 'Requisitioning Office',
          request_date: "Request Date",
          totalAmount: "Total Amount",
          status: 'Status'
        },
        formatters:{
          totalAmount: (value)=>this.currencyPipe.transform(value?.toString(), 'PHP', 'symbol', '1.2-2') ?? '',
          request_date: (value)=>this.datePipe.transform(value?.toString(),'longDate') ?? ''
        },
        data: [],
        steps:[
          {
            id:'Draft',
            label:'Draft',
            icon:'pi pi-inbox',
          },
          {
            id:'Pending',
            label:'Pending',
            icon:'pi pi-spinner-dotted pi-spin',
          },
          {
            id:'Approved',
            label:'Approved',
            icon:'pi pi-verified',
          },
        ],
        activeStep: 0,
        topActions: [
          {
            label: 'Create Purchase Request',
            icon: 'pi pi-plus',
            tooltip: 'Click to draft purchase request',
            function: async () => {
              // TODO: Implement adding new procurement process
              // this.approverForm.tits
            }
          }
        ],
        stepField: 'status',
        rowActions : [
          {
            hidden: (args:PurchaseRequestJoin)=> args.status !='Draft',
            shape: 'rounded',
            tooltip: 'Click to delete purchase request',
            icon: 'pi pi-trash',
            confirmation: 'Are you sure you want to delete this purchase request?',
            color:'danger',
            function: async(event:Event, process: PurchaseRequestJoin) => {
              // TODO: Implement deleting procurement process
              // this.approvalSequence.dataLoaded = false;
              // await this.crudService.delete(Approver, process.id)
              // await this.loadData();
              // this.approvalSequence.dataLoaded = true;
            }
          },
          {
            shape: 'rounded',
            tooltip: 'Click to view purchase request',
            icon: 'pi pi-eye',
            function: async(event:Event, process: PurchaseRequestJoin) => {
              // TODO: Implement deleting procurement process
              // this.approvalSequence.dataLoaded = false;
              // await this.crudService.delete(Approver, process.id)
              // await this.loadData();
              // this.approvalSequence.dataLoaded = true;
            }
          },
          {
            hidden: (args:PurchaseRequestJoin)=> args.status !='Draft',
            shape: 'rounded',
            tooltip: 'Click to finalize purchase request',
            color: 'success',
            icon: 'pi pi-arrow-right',
            confirmation: 'Are you sure you want to finalize this purchase request?',
            function: async (event:Event,row:PurchaseRequestJoin) => {
              // this.approverForm.title = 'Edit Approval Sequence';
              // this.approverForm.description = 'Edit existing approval sequence';
              // this.approverForm.data = row;
              // this.approverForm.show = true;
            }
          },
        ],
      }

      async loadData() {
        const prs = await this.crudService.getAll(PurchaseRequest);
        const ppmps = await this.crudService.getAll(PPMP);
        const projects = await this.crudService.getAll(PPMPProject);
        const items = await this.crudService.getAll(PPMPItem);
        const offices = await this.crudService.getAll(Office);
        this.user =  this.userService.getUser();
        console.log(this.user);
        this.prRequests.data = prs.filter(pr=>{
          // filter nones
          const project = projects.find(p=>p.id == pr.project_id);
          const ppmp  = ppmps.find(p=>p.id == project?.ppmp_id); 
          const office = offices.find(o=>o.id == ppmp?.office_id)
          return office?.id == this.user?.officeId
        }).map(pr=> {
          const project = projects.find(p=>p.id == pr.project_id)
          const ppmp  = ppmps.find(p=>p.id == project?.ppmp_id); 
          const office = offices.find(o=>o.id == ppmp?.office_id.toString())
          const _items = items.filter(i=>i.ppmp_project_id == project?.id);
          return {
            ...pr,
            request_date: new Date(pr.request_date),
            office: office?.name ?? 'NA',
            totalAmount: _items.reduce((acc,item)=> acc + (item.estimated_unit_cost * item.quantity_required), 0),
          }
        })
        this.prRequests.dataLoaded = true;
      }
}