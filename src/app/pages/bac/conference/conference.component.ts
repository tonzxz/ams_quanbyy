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
  preProcurementInvitations: any[] = [];
  preBiddingInvitations: any[] = [];

  activeTabIndex: number = 0;

  invitations: any[] = [];

  availableEvents: any[] = [];

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
    this.preProcurementEvents = [];
    this.preBiddingEvents = [];
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

    // Directly use event.value as the code
    this.selectedModeCode = event.value;

    // Find the selected mode from meetMode array
    this.selectedMode = this.meetMode.find(mode => mode.code === this.selectedModeCode) || null;

    // Clear platform if In-Person, else select available platform
    if (this.selectedModeCode === 'IP') {
        this.selectedPlatform = null;
    } else {
        const platforms = this.getPlatformsForSelectedMode();
        this.selectedPlatform = platforms.length > 0 ? platforms[0] : null;
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

  onEventSelect(event: any, context: string) {
    if (context === 'edit') {
      // Directly assign event without .value for edit mode
      this.selectedEvent = event;
  
      // Autofill all fields for edit
      this.eventName = this.selectedEvent?.name || '';
      this.eventDate = this.selectedEvent?.date || null;
      this.eventTime = this.selectedEvent?.eventTime || null;
      this.selectedMode = this.selectedEvent?.mode || this.selectedMode;
      this.selectedModeCode = this.selectedEvent?.mode?.code || '';
      this.selectedPlatform = this.selectedEvent?.platform || this.selectedPlatform;
      this.selectedPlatformCode = this.selectedEvent?.platform?.code || '';

      this.selectedPlatform = this.selectedModeCode === 'IP'
      ? { name: 'N/A', code: '' }
      : (this.getPlatformsForSelectedMode()[0] || { name: 'N/A', code: '' });
  
      this.editEventModal = true; // Open edit modal
    } else if (context === 'invite') {
      // Keep using event.value for invite mode
      this.selectedEvent = event.value;
  
      // Autofill for invite
      this.eventName = this.selectedEvent?.name || '';
      this.eventDate = this.selectedEvent?.date || null;
      this.eventTime = this.selectedEvent?.eventTime || null;
      this.selectedMode = this.selectedEvent?.mode || this.selectedMode;
      this.selectedModeCode = this.selectedEvent?.mode?.code || '';
      this.selectedPlatform = this.selectedEvent?.platform || this.selectedPlatform;
      this.selectedPlatformCode = this.selectedEvent?.platform?.code || '';
    }
  }


  saveEditedEvent() {
    if (this.selectedEvent) {
      this.selectedEvent.name = this.eventName;
      this.selectedEvent.date = this.eventDate;
      this.selectedEvent.eventTime = this.eventTime;
      this.selectedEvent.mode = this.selectedMode;

      
      // Match selectedPlatform code to full platform object
      const platforms = this.getPlatformsForSelectedMode();
      const matchedPlatform = platforms.find(p => p.code === this.selectedPlatform);

      if (this.selectedModeCode === 'IP') {
        this.selectedEvent.platform = { name: 'N/A', code: '' };
      } else if (matchedPlatform) {
        this.selectedEvent.platform = matchedPlatform;
      } else {
        this.selectedEvent.platform = platforms[0] || { name: 'N/A', code: '' };
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Event Updated',
        detail: 'The event has been successfully updated.'
      });
  
      this.editEventModal = false;
      this.cdr.detectChanges();
    }
  }

  getPlatformsForSelectedMode() {
    return this.platformsByMode[this.selectedModeCode] || [];
  }

  OpenEventCard() {
    this.eventCard = true;
  }

  addEvent(tabIndex: number) {      
    console.log('Add Event - Tab Index:', tabIndex);
    this.activeTabIndex = tabIndex;
    this.eventDate = null;           
    this.selectedMode = null;      
    this.selectedModeCode = '';  
    this.selectedPlatform = null;    
    this.selectedPPMP = null;  
    this.purchaseRequests = '';
    this.eventTime = null;            
    this.eventModal = true;
  }

  createInvite(tabIndex: number) {
    console.log('Create Invite - Tab Index:', tabIndex);   
    this.selectedEvent = null; 
    this.activeTabIndex = tabIndex;
    this.invitationTitle = '';
    this.eventTime = null;
    this.eventDate = null;
    this.selectedMode = null;
    this.selectedPlatform = null;
    this.selectedParticipants = [];

    console.log('Active Tab Index on Create Invite:', this.activeTabIndex); 
    // Populate dropdown with created events based on active tab
    this.availableEvents = this.activeTabIndex === 0 ? this.preProcurementEvents : this.preBiddingEvents;
    console.log('Available Events:', this.availableEvents);

    this.inviteModal = false; // Briefly hide to reset state
    setTimeout(() => {
    this.inviteModal = true;
    this.cdr.detectChanges();
    }, 0);
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
      eventTime: this.eventTime,
      mode: this.selectedMode,
      platform: this.selectedMode.code === 'IP' ? { name: 'N/A', code: '' } : this.selectedPlatform
    };

    console.log('Saving event on tab index:', this.activeTabIndex);
    console.log('New Event:', newEvent);
    console.log('Pre-Procurement Events before:', this.preProcurementEvents);
    console.log('Pre-Bidding Events before:', this.preBiddingEvents);

    // Add event to the appropriate array based on the active tab
    if (this.activeTabIndex === 0) {
      this.preProcurementEvents = [...this.preProcurementEvents, newEvent];
      console.log('Saved to Pre-Procurement Events:', this.preProcurementEvents);
    } else if (this.activeTabIndex === 1) {
      this.preBiddingEvents = [...this.preBiddingEvents, newEvent];
      console.log('Saved to Pre-Bidding Events:', this.preBiddingEvents);
    } else {
      console.error('Invalid tab index:', this.activeTabIndex); 
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Event Saved',
      detail: 'The event has been saved successfully.'
    });

    this.eventModal = false;
  }

  onEditModeChange(event: any) {
    if (!event.value) return;
  
    this.selectedModeCode = event.value;
    this.selectedMode = this.meetMode.find(mode => mode.code === this.selectedModeCode) || null;
  
    if (this.selectedModeCode === 'IP') {
        this.selectedPlatform = null;
    } else {
        const platforms = this.getPlatformsForSelectedMode();
        this.selectedPlatform = platforms.length > 0 ? platforms[0] : null;
    }
    this.cdr.detectChanges();
  }
  
  cancelEdit() {
    this.editEventModal = false;
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
      title: this.selectedEvent.ppmp.name,
      ppmp: this.selectedEvent.ppmp,
      date: this.selectedEvent.date,
      time: this.eventTime,
      mode: this.selectedEvent.mode,
      platform: this.selectedEvent.platform,
      participants: this.selectedParticipants
    };

    if (this.activeTabIndex === 0) {
      this.preProcurementInvitations = [...this.preProcurementInvitations, invitation];
    } else if (this.activeTabIndex === 1) {
      this.preBiddingInvitations = [...this.preBiddingInvitations, invitation];
    }

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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    console.log('Active Tab Index:', this.activeTabIndex);
    this.cdr.detectChanges();
  }
  
}