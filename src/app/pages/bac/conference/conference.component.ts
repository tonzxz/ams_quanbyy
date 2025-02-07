import { Component, OnInit } from '@angular/core';
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
    DropdownModule
  ],
  templateUrl: './conference.component.html',
  styleUrl: './conference.component.scss',
  providers: [MessageService]
})
export class ConferenceComponent implements OnInit {
  eventCard: boolean = false;
  eventModal: boolean = false;
  inviteModal: boolean = false;

  eventName: string = '';   
  eventDate: string = '';   

  selectedModeCode: string = '';
  selectedPlatformCode: string = '';

  selectedMode: any = { name: 'Online', code: 'ON' }; // Example default value
  selectedPlatform: any = { name: 'Zoom', code: 'ZM' };
  selectedEvent: any;
  selectedParticipants: any[] = [];

  selectedPPMP: any;
  purchaseRequests: string = '';

  meetMode: any[] = [];
  platformsByMode: { [key: string]: any[] } = {};
  events: any[] = [];
  participants: any[] = [];
  
  ppmpList: any[] = [];  // Define ppmpList for PPMP options
  
  constructor(private messageService: MessageService) {}

  ngOnInit() {
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
      'IP': [],  // No platforms for In-Person
      'HY': [
        { name: 'Google Meet', code: 'GM' },
        { name: 'Zoom', code: 'ZM' }
      ]
    };

    this.events = [
      { name: 'Event 1', date: '2025-02-10', mode: { name: 'Online', code: 'ON' }, platform: { name: 'Zoom', code: 'ZM' } },
      { name: 'Event 2', date: '2025-02-15', mode: { name: 'In-Person', code: 'IP' }, platform: null },
      { name: 'Event 3', date: '2025-02-20', mode: { name: 'Hybrid', code: 'HY' }, platform: { name: 'Google Meet', code: 'GM' } }
    ];

    this.participants = [
      { name: 'John Doe', id: 1 },
      { name: 'Jane Smith', id: 2 },
      { name: 'Alice Johnson', id: 3 }
    ];

    // Add PPMP List (example values)
    this.ppmpList = [
      { name: 'Procurement Plan A', code: 'PA' },
      { name: 'Procurement Plan B', code: 'PB' },
      { name: 'Procurement Plan C', code: 'PC' }
    ];
  }

  onPPMPChange(event: any) {
    this.purchaseRequests = event.value.purchaseRequests || ''; // Auto-fill purchase requests
  }

  onModeChange(event: any) {
    this.selectedMode = this.meetMode.find(mode => mode.code === this.selectedModeCode) || { name: '', code: '' };
  
    // Reset platform selection if mode does not have platforms
    if (this.selectedMode.code === 'IP') {  // In-Person has no platforms
      this.selectedPlatform = null;  // Reset platform
    } else {
      this.selectedPlatform = { name: '', code: '' };  // Reset for Online/Hybrid
    }

    this.selectedPlatformCode = '';
  }


  getPlatformsForSelectedMode() {
    if (!this.selectedMode || !this.selectedMode.code) {
      return [];
    }
    return this.platformsByMode[this.selectedMode.code] || [];
  }

  OpenEventCard() {
    console.log('Card clicked!');
    this.eventCard = true;
  }

  addEvent() {
    this.eventModal = true;
  }

  createInvite() {
    this.inviteModal = true;
  }

  onEventChange(event: any) {
    if (event.value) {
      this.eventDate = event.value.date;
      this.selectedMode = event.value.mode;
      this.selectedPlatform = event.value.platform;
    }
  }

  saveEvent() {
    this.eventModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Event Saved',
      detail: 'The event has been saved successfully.'
    });
  }

  sendInvite() {
    this.inviteModal = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Invitation Sent',
      detail: 'The invitation has been sent successfully.'
    });
  }
}

