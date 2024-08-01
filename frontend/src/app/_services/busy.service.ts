import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusyComponent } from '../busy-component/busy-component.component'; // Убедитесь, что путь правильный

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private dialog: MatDialog) {}

  busy() {
    this.busyRequestCount++;
    if (this.busyRequestCount === 1) {
      this.dialog.open(BusyComponent, {
        disableClose: true,
        panelClass: 'transparent-dialog'
      });
    }
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.dialog.closeAll();
    }
  }
}
