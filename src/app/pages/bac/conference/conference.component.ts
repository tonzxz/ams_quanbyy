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
import { CommonModule } from '@angular/common';

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
    CommonModule
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
    this.selectedModeCode = 'ON'; // Default to Online mode
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
      'IP': [],  // No platforms for In-Person
      'HY': [
        { name: 'Google Meet', code: 'GM' },
        { name: 'Zoom', code: 'ZM' }
      ]
    };

    console.log("platformsByMode initialized:", this.platformsByMode);

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
      { name: 'Procurement Plan A', code: 'PA', purchaseRequests: 'Request 1, Request 2' },
      { name: 'Procurement Plan B', code: 'PB', purchaseRequests: 'Request 3, Request 4' },
      { name: 'Procurement Plan C', code: 'PC', purchaseRequests: '' } // No purchase requests
    ];
  }

  onModeChange(event: any) {
    if (!event.value || event.value === this.selectedModeCode) {
        console.log("Mode didn't change, skipping update.");
        return;
    }

    console.log("Mode changed:", event.value);

    // Update selected mode and mode code
    this.selectedModeCode = event.value;
    this.selectedMode = this.meetMode.find(mode => mode.code === event.value) || { name: '', code: '' };

    // Reset or update platform selection
    if (this.selectedModeCode === 'IP') {
        this.selectedPlatform = null;
    } else {
        const platforms = this.getPlatformsForSelectedMode();
        this.selectedPlatform = platforms.length > 0 ? platforms[0] : { name: '', code: '' };
    }

    console.log("Updated Selected Mode:", this.selectedMode);
    console.log("Updated Selected Platform:", this.selectedPlatform);
  }




  onPPMPChange() {
    if (this.selectedPPMP) {
      console.log('Selected PPMP:', this.selectedPPMP);
      this.purchaseRequests = this.selectedPPMP.purchaseRequests || 'No purchase requests available.';
    } else {
      this.purchaseRequests = 'No purchase requests available.';
    }
  }
  

  getPlatformsForSelectedMode() {
    console.log("Selected Mode Code:", this.selectedModeCode);
    console.log("Platforms Available:", this.platformsByMode[this.selectedModeCode] || []);

    return this.selectedModeCode ? this.platformsByMode[this.selectedModeCode] || [] : [];
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
    if (!event.value) return;

    console.log("Event selected:", event.value);

    // Update event details
    this.selectedEvent = event.value;
    this.eventDate = event.value.date || ''; // Ensure it's empty if undefined
    this.selectedMode = event.value.mode || null; // Set to null if no mode is provided

    // Set platform only if mode is online or hybrid
    if (this.selectedMode && this.selectedMode.code !== 'IP') {
        const platforms = this.getPlatformsForSelectedMode();
        this.selectedPlatform = platforms.length > 0 ? platforms[0] : null;
    } else {
        this.selectedPlatform = null;
    }

    console.log("Updated Mode:", this.selectedMode);
    console.log("Updated Platform:", this.selectedPlatform);
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

