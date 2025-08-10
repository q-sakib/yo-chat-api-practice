import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import '@ui5/webcomponents/dist/Avatar.js';


@Component({
  selector: 'app-header',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() selectedUser: any | null = null;
}
