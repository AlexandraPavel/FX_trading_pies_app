import { HostBinding, Input, OnInit, SimpleChanges } from '@angular/core';
import { Component, Inject } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';
import { ChartService } from 'src/app/services/chart.service';
import { PieItem } from '../ui/model/pie-item';
import { PieService } from '../ui/service/pie.service';
import { ProcentItem } from './model/procent-item';
import { list } from './model/list';
import { ListService } from './service/list-slices.service';
import { ItemService } from './service/item-slice.service';
import { ToastrService } from 'ngx-toastr';
  
@Component({ 
  selector: 'app-dialog-create-pie', 
  templateUrl: 'dialog-create-pie.component.html', 
}) 
export class DialogCreatePie implements OnInit {
  public list: ProcentItem[] | undefined;
  expanded = false;
  data_1 = {}
  saveButton = false;


  showDelay = new FormControl(1000);
  hideDelay = new FormControl(2000); 
  procent = new FormControl(0);
  totalProcent = 0;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() depth!: number;

  constructor(
    public pieService: PieService,
    public chartService: ChartService,
    private listService: ListService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DialogCreatePie>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialogRef.updateSize('60vw', '40vw');
      if (this.depth === undefined) {
        this.depth = 0;
      }
     } 


  ngOnInit(): void {
   this.listService.list$.subscribe((list) => {
      this.list = list;
      this.calculateTotalProcent(list);
    });
  }

  private calculateTotalProcent(list: ProcentItem[]): void {
    this.totalProcent = list.map(item => parseInt(item.value, 10)).reduce((acc, currentValue) => acc + currentValue, 0);
    if (this.totalProcent > 100) {
      this.toastr.warning('Total percentage exceeds 100%', 'Warning');
      this.saveButton = true;
    } else
      this.saveButton = false;
  }

  onItemSelected(item: PieItem): void {
      // this.dialog.closeAll();

      if (!item.children || !item.children.length) {
          if (item.route) {
              this.pieService.updateData(item);
              // this.router.navigate([item.route]);
          }
      }

      if (item.children && item.children.length) {
          this.expanded = !this.expanded;
      }
  }



  onCancel(): void { 
    this.dialogRef.close(); 
  } 

  onAddSlice(): void {
    let entry: ProcentItem =
      {
        value : '0',
        displayName : '',
        route: 'example'
      }
    // list.push(entry)
    this.listService.addSlice(entry);
  }
}