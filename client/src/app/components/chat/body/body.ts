import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/Button.js';
	import '@ui5/webcomponents-icons/dist/paper-plane.js';
  import '@ui5/webcomponents/dist/Avatar.js';
@Component({
  selector: 'app-body',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  @Input() messages: any[] = [];
  @Input() currentUser: any;

  @Output() send = new EventEmitter<string>();

  newMessage: string = '';

  emitMessage() {
    const msg = this.newMessage?.trim();
    if (!msg) return;

    this.send.emit(msg);
    this.newMessage = '';
  }

  onInputChange(event: any) {
    this.newMessage = event.target.value;
  }
}
