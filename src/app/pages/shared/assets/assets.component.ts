import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { DataViewModule } from 'primeng/dataview';
import { Stock, StocksService } from 'src/app/services/stocks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {  IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { LottieAnimationComponent } from '../../ui-components/lottie-animation/lottie-animation.component';
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [MaterialModule,DataViewModule, CommonModule, 
    LottieAnimationComponent,
    FormsModule, SelectButtonModule, ButtonModule, TagModule, IconFieldModule, InputTextModule,InputIconModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit {
  assets:Stock[]=[];
  filteredAssets = signal<any>([]);

  options = ['list', 'grid'];

  layout: 'list'|'grid' = 'grid';

  search:string = '';

  constructor(private stockService:StocksService){}

  ngOnInit(): void {
    this.fetchItems();
  }

  filterBySearch(){
    this.filteredAssets.set(this.assets.filter(asset=>
        asset.name.toLowerCase().includes(this.search) ||
        asset.ticker.toLowerCase().includes(this.search) || 
        asset.dr_id.toLowerCase().includes(this.search)
    ))
  }

  async fetchItems(){
    this.assets = await this.stockService.getAll();
    this.filteredAssets.set(this.assets);
  }

}
