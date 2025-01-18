import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { User, UserService } from 'src/app/services/user.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule,
    BreadcrumbModule,ConfirmDialogModule, DividerModule
  ],
  templateUrl: './header.component.html',
  providers:[ConfirmationService],
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

  constructor(private userService:UserService, private confirmationService:ConfirmationService) {}

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
      { icon: 'pi pi-home', route: '/installation' }, 
      { label: 'Delivery Receipts' }, 
      { label: 'Supplier 01' }, 
      { label: 'DR-100391' }, 
    ];
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

  logout(){
    this.userService.logout();
  }
}
