import { Component } from '@angular/core';

@Component({
  selector: 'app-busy',
  template: `<div class="busy-overlay">
               <mat-spinner></mat-spinner>
             </div>`,
  styles: [`
    .busy-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: 1000;
    }
  `]
})
export class BusyComponent {}
