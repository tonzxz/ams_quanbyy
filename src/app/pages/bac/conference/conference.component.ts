import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { Toast } from 'primeng/toast';
import { Menu, MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-conference',
  standalone: true,
  imports: [
    CardModule, 
    DatePicker, 
    InputText,
    ButtonModule,
    MultiSelect,
    Toast,
    Menu,
    MenuModule, 
    DividerModule,
    Dialog,
    CascadeSelectModule,
    Select,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    TabsModule, 
    TabViewModule,
    CalendarModule
  ],
  templateUrl: './conference.component.html',
  styleUrl: './conference.component.scss',
  providers: [MessageService]
})
export class ConferenceComponent implements OnInit {
  preProcurementEvents: any[] = [];
  preBiddingEvents: any[] = [];

  invitations: any[] = [];

  invitationTitle: string = '';
  invitationDate: Date | null = null;
  eventTime: Date | null = null;

  eventCard: boolean = false;
  eventModal: boolean = false;
  inviteModal: boolean = false;
  editEventModal: boolean = false;

  eventName: string = '';   
  eventDate: Date | null = null;  

  selectedModeCode: string = '';
  selectedPlatformCode: string = '';

  selectedMode: any = { name: 'Online', code: 'ON' };
  selectedPlatform: any = { name: 'Zoom', code: 'ZM' };
  selectedPPMP: any = null;
  selectedParticipants: any[] = [];
  selectedEvent: any = {};

  purchaseRequests: string = '';

  meetMode: any[] = [];
  platformsByMode: { [key: string]: any[] } = {};
  events: any[] = [];
  participants: any[] = [];

  ppmpList: any[] = [];

  constructor(private messageService: MessageService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.selectedModeCode = 'ON';
    this.selectedPPMP = this.ppmpList[0];

    this.meetMode = [
      { name: 'Online', code: 'ON' },
      { name: 'In-Person', code: 'IP' },
      { name: 'Hybrid', code: 'HY' }
    ];

    this.platformsByMode = {
      'ON': [
        { name: 'Google Meet', code: 'GM' },
        { name: 'Zoom', code: 'ZM' }
      ],
      'IP': [],
      'HY': [
        { name: 'Google Meet', code: 'GM' },
        { name: 'Zoom', code: 'ZM' }
      ]
    };

    this.participants = [
      { name: 'John Doe', id: 1 },
      { name: 'Jane Smith', id: 2 },
      { name: 'Alice Johnson', id: 3 }
    ];

    this.ppmpList = [
      { name: 'Procurement Plan A', code: 'PA', purchaseRequests: 'Request 1, Request 2' },
      { name: 'Procurement Plan B', code: 'PB', purchaseRequests: 'Request 3, Request 4' },
      { name: 'Procurement Plan C', code: 'PC', purchaseRequests: '' }
    ];

    this.selectedPPMP = this.ppmpList[0];
  }

  onModeChange(event: any) {
    if (!event.value) return;

    this.selectedModeCode = event.value;
    this.selectedMode = this.meetMode.find(mode => mode.code === event.value) || { name: '', code: '' };

    if (this.selectedModeCode === 'IP') {
      this.selectedPlatform = null;
    } else {
      const platforms = this.getPlatformsForSelectedMode();
      this.selectedPlatform = platforms.length > 0 ? platforms[0] : { name: '', code: '' };
    }
  }

  onPPMPChange(event: any) {
    if (event.value) {
      this.selectedPPMP = event.value;
      this.purchaseRequests = this.selectedPPMP.purchaseRequests || 'No purchase requests available.';
    } else {
      this.selectedPPMP = null;
      this.purchaseRequests = 'No purchase requests available.';
    }
  }

  onEventSelect(event: any) {
    if (event?.value) {
      this.selectedEvent = event.value;
      this.eventName = this.selectedEvent?.name || '';  // Set event name here
      this.eventDate = this.selectedEvent?.date || null;
      this.eventTime = this.selectedEvent?.eventTime || null;
      this.selectedMode = this.selectedEvent?.mode || this.selectedMode;
      this.selectedModeCode = this.selectedEvent?.mode?.code || '';
      this.selectedPlatform = this.selectedEvent?.platform || this.selectedPlatform;
      this.selectedPlatformCode = this.selectedEvent?.platform?.code || '';
      this.editEventModal = true;
    }
  }

  saveEditedEvent() {
    if (this.selectedEvent) {
      this.selectedEvent.name = this.eventName;  // Save back the updated name
      this.selectedEvent.date = this.eventDate;
      this.selectedEvent.eventTime = this.eventTime;
      this.selectedEvent.mode = this.selectedMode;
      this.selectedEvent.platform = this.selectedPlatform;
  
      this.messageService.add({
        severity: 'success',
        summary: 'Event Updated',
        detail: 'The event has been successfully updated.'
      });
  
      this.editEventModal = false;
    }
  }

  getPlatformsForSelectedMode() {
    return this.selectedModeCode ? this.platformsByMode[this.selectedModeCode] || [] : [];
  }

  OpenEventCard() {
    this.eventCard = true;
  }

  addEvent() {      
    this.eventDate = null;           
    this.selectedMode = null;      
    this.selectedModeCode = '';  
    this.selectedPlatform = null;    
    this.selectedPPMP = null;  
    this.purchaseRequests = '';
    this.eventTime = null;            
    this.eventModal = true;
  }

  createInvite() {
    this.invitationTitle = '';
    this.eventTime = null;      
    this.eventDate = null;            
    this.selectedMode = null;        
    this.selectedPlatform = null;    
    this.selectedParticipants = [];
    this.inviteModal = true;
  }

  saveEvent() {
    if (!this.eventDate || !this.selectedMode || !this.selectedPPMP || !this.eventTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Please fill in all required fields before saving the event.'
      });
      return;
    }
  
    const newEvent = {
      ppmp: this.selectedPPMP,
      date: this.eventDate,
      eventTime: this.eventTime, // Save the chosen time
      mode: this.selectedMode,
      platform: this.selectedMode.code === 'IP' ? { name: 'N/A', code: '' } : this.selectedPlatform
    };
  
    this.events = [...this.events, newEvent];
  
    this.messageService.add({
      severity: 'success',
      summary: 'Event Saved',
      detail: 'The event has been saved successfully.'
    });
  
    this.eventModal = false;
  }
  
  sendInvite() {
    if (!this.selectedEvent || !this.eventTime) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing Fields',
        detail: 'Please select an event and specify the time before sending the invitation.'
      });
      return;
    }

    const invitation = {
      title: this.selectedEvent.name,
      ppmp: this.selectedEvent.ppmp,
      date: this.selectedEvent.date,
      time: this.eventTime,
      mode: this.selectedEvent.mode,
      platform: this.selectedEvent.platform,
      participants: this.selectedParticipants
    };

    this.invitations = [...this.invitations, invitation];

    this.messageService.add({
      severity: 'success',
      summary: 'Invitation Sent',
      detail: `Invitation for ${this.selectedEvent.name} sent successfully.`
    });

    this.inviteModal = false;
    this.selectedEvent = null;
    this.invitationTitle = '';
    this.eventTime = null;
  }
}