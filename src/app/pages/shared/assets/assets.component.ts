import { Component, OnInit, signal } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { DataViewModule } from 'primeng/dataview';
import { StocksService } from 'src/app/services/stocks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [MaterialModule,DataViewModule, CommonModule, FormsModule, SelectButtonModule, ButtonModule, TagModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit {
  assets = signal<any>([]);

  options = ['list', 'grid'];

  layout: 'list'|'grid' = 'grid';

  constructor(private stockService:StocksService){}

  ngOnInit(): void {
    this.fetchItems();
  }

  async fetchItems(){
    const stocks = await this.stockService.getAll();
    this.assets.set([...stocks]);
  }

}
