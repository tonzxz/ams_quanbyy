import { Component, Input } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule, TableRowReorderEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LottieAnimationComponent } from 'src/app/pages/ui-components/lottie-animation/lottie-animation.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';



interface Tab<T, K extends keyof T> {
  id: T[K],
  label: string,
  actions?: RowAction<T>[]
  tooltip?: string,
  icon?: string,
  function?: (event: Event, id: T[K]) => void
}

interface RowAction<T> {
  icon: string,
  shape: 'rounded' | 'default',
  function?: (event: Event, args: T) => void,
  confirmation?: string,
  disabled?: (args: T) => boolean,
  hidden?: (args: T) => boolean,
  color?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast',
  label?: string,
  tooltip?: string;
}
interface TopAction<T> {
  icon: string,
  function: () => void
  color?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast',
  label?: string,
  tooltip?: string;
}
export interface MultiTableData<T, K extends keyof T | undefined = undefined> {
  title: string,
  type: 'default' | 'sequence',
  description: string,
  columns: { [K in keyof Partial<T>]: string },
  data: T[],
  tabField?: K,
  tabs?: Tab<T, Exclude<K, undefined>>[],
  activeTab?: number,
  dragEvent?: (event: TableRowReorderEvent) => void;
  formatters?: { [K in keyof Partial<T>]: (value: T[keyof T]) => string },
  searchFields?: (keyof T)[],
  topActions?: TopAction<T>[],
  rowActions?: RowAction<T>[],
  dataLoaded?: boolean
}

@Component({
  selector: 'app-multi-table',
  standalone: true,
  imports: [
    MaterialModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    InputSwitchModule,
    TabViewModule,
    LottieAnimationComponent,
    TooltipModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    TabsModule,
    ConfirmPopupModule,
    TableModule,],
  templateUrl: './multi-table.component.html',
  styleUrl: './multi-table.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class MultiTableComponent<T, K extends keyof T | undefined = undefined> {
  @Input() config?: MultiTableData<T, K>;

  constructor(private confirmationService: ConfirmationService) { }

  getColumnNames(): string[] {
    if (this.config) {
      const table_names = Object.values(this.config.columns) as string[];
      return table_names;
    } else {
      return []
    }
  }

  getSearchFields(): string[] {
    if (this.config) {
      if (this.config.searchFields) {
        return this.config.searchFields as string[];
      }
      const table_names = Object.keys(this.config.columns);
      return table_names;
    } else {
      return []
    }
  }

  getFields(): (keyof T)[] {
    if (this.config) {
      const table_names = Object.keys(this.config.columns) as (keyof T)[];
      return table_names;
    } else {
      return []
    }
  }
  formatValue(field: keyof T, row: T) {
    if (this.config) {
      if (!this.config.formatters) return row[field];
      if (field in this.config.formatters) {
        return this.config.formatters[field]!(row[field])
      } else {
        return row[field];
      }
    } else {
      throw new Error('Progress Table config has not been loaded')
    }
  }

  hasActions() {
    if (this.config) {
      if (this.config.rowActions) {
        return this.config.rowActions?.length
      } else {
        if (this.config.tabs) {
          return this.config.tabs[this.config.activeTab!].actions?.length;
        } else {
          return false
        }
      }
    } else {
      return false;
    }
  }

  getRowActions(): RowAction<T>[] {
    if (this.config) {
      if (this.config.rowActions) {
        return this.config.rowActions
      } else {
        if (this.config.tabs) {
          if (this.config.tabs[this.config.activeTab!].actions) {
            return this.config.tabs[this.config.activeTab!].actions!;
          }
        }
      }
    }
    return [];
  }

  filteredData(): T[] {
    if (this.config) {
      const tabs = this.config.tabs;
      if (tabs) {
        return this.config.data.filter(d => d[this.config?.tabField as keyof T] == tabs[this.config?.activeTab!].id);
      } else {
        return this.config.data;
      }
    } else {
      return []
    }
  }

  onRowOrder(event: TableRowReorderEvent) {
    if (this.config) {
      const rows = this.filteredData();
      const realDragIndex = this.config.data.findIndex(d => d == rows[event.dragIndex!])
      const realDropIndex = this.config.data.findIndex(d => d == rows[event.dropIndex!])
      this.config?.dragEvent!({ dragIndex: realDragIndex, dropIndex: realDropIndex });
    } else {
      throw new Error('Config is not initialized')
    }
  }

  confirm(event: Event, data:T ,rowAction:RowAction<T>) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: rowAction.confirmation,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirm'
      },
      accept: async () => {
        if(rowAction.function){
          rowAction.function(event,data);
        }
      },
      reject: () => {

      }
    });
  }

  changeTab(tab: number) {
    this.config!.activeTab = tab;
  }

}
