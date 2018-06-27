import { Component } from '@angular/core';

@Component({
  selector: 'app-key-up',
  template: `
    <input #box
      (keyup.enter)="update(box.value)"
      (blur)="update(box.value)">

    <p>{{value}}</p>
  `
})
export class KeyupComponent {
  value = '';
  update(value: string) { this.value = value; }
}
