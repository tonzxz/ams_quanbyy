import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { User, UserService } from 'src/app/services/user.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { BreadcrumbService } from 'src/app/services/breadcrump.service';
import { BadgeModule } from 'primeng/badge';
import { PanelModule } from 'primeng/panel';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { filter } from 'rxjs';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AppNotification, NotificationService } from 'src/app/services/notifications.service';
import { ToastModule } from 'primeng/toast';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import {  InputTextModule } from 'primeng/inputtext';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule, BadgeModule,OverlayBadgeModule,IconFieldModule, InputIconModule,InputTextModule,
    BreadcrumbModule,ConfirmDialogModule, DividerModule,PanelModule,ScrollPanelModule, ToastModule, AutoCompleteModule, FormsModule,
  ],
  templateUrl: './header.component.html',
  providers:[ConfirmationService,MessageService],
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  items:MenuItem[];
  user?:User;

  intervalId: any;
  currentTime: Date = new Date();
  greeting: string;
  notifications:AppNotification[]=[];

  suggestions:{value:string, location:string}[]=[{value:'REC0012348',location:'Delivery Receipts'},
    {value:'REC0012350',location:'Delivery Receipts'},
    {value:'REC0012351',location:'Delivery Receipts'},
    {value:'Office Essentials Ltd.',location:'Offices'},
    {value:'Main Warehouse.',location:'Inventory Location'},
    {value:'DV-2025-321902',location:'Disbursement Voucher'},
    {value:'Asset',location:'Industrial Printer'},]
  filteredSuggestions:{value:string, location:string}[]=[];
  searchValue:string='';

  constructor(private userService:UserService, 
    private router:Router,
    private utilService: UtilsService,
    private activatedRoute:ActivatedRoute,
    private messageService:MessageService,
    private notificationService:NotificationService,
    private breadcrumpService:BreadcrumbService,
    private confirmationService:ConfirmationService) {}

  search(event: AutoCompleteCompleteEvent) {
      this.filteredSuggestions = this.suggestions.filter((a)=>a.value.includes(event.query)) ;
  }

  getGreeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) {
      return 'Good Morning 🌞';
    } else if (hour < 18) {
      return 'Good Afternoon 🌞';
    } else {
      return 'Good Evening 🌙';
    }
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.greeting = this.getGreeting();
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
      this.greeting = this.getGreeting();
    }, 60000);  // 60000 milliseconds = 1 minute
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      ...this.breadcrumpService.createBreadcrumbs(this.activatedRoute.root)];
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.items = [
          { icon: 'pi pi-home', route: '/' },
          ...this.breadcrumpService.createBreadcrumbs(this.activatedRoute.root)];
      });

    this.notificationService.notifications$.subscribe(list=>{
      this.notifications = list ;
      this.notifications = this.notifications.filter(notif => notif.toUserId == this.user?.id)
      this.notifications = this.notifications.reverse();
      // To fix
      // if(this.notifications.length > 0 && this.notifications[0].toUserId == this.user?.id){
      //   if(this.notifications.find(notif=>!notif.read)){
      //     this.messageService.add({ severity: 'success', summary: 'Success', detail: `You have new notifications.` });
      //   }
      // }
    })
  }

  confirmLogout(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to logout?',
        header: 'Account Logout',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            severity:'danger',
            label: 'Logout',
        },
        accept: () => {
            this.logout();
        },
        reject: () => {
            
        },
    });
}

getUnreadCount():number{
  return this.notifications.filter(notif=>!notif.read).length
}

markNotificationsAsRead(){ 
  for(let notification of this.notifications){
    this.notificationService.markAsRead(notification.id);
  }
}

isDarkModeEnabled(){
  return this.utilService.isDarkModeEnabled();
}

toggleDarkMode(){
  this.utilService.toggleDarkMode();
} 

  logout(){
    this.userService.logout();
  }
}
