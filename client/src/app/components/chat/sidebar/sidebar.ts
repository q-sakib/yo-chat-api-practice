import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@ui5/webcomponents/dist/Avatar.js';
import '@ui5/webcomponents-icons/dist/log.js'; // For logout icon
import '@ui5/webcomponents/dist/Icon.js';
import '@ui5/webcomponents-icons/dist/overflow';
import '@ui5/webcomponents-icons/dist/slim-arrow-down';


@Component({
  selector: 'app-sidebar',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() users: any[] = [];
  @Input() selectedUser: any;
  @Input() currentUser: any;

  @Output() userSelected = new EventEmitter<any>();
  @Output() logout = new EventEmitter<void>();

  showLogoutDropdown = false;
  fallback: any;

  selectUser(user: any) {
    this.userSelected.emit(user);
  }

  toggleLogoutDropdown() {
    this.showLogoutDropdown = !this.showLogoutDropdown;
  }

  onLogout() {
    this.logout.emit();
    this.showLogoutDropdown = false;
  }

  get fallbackAvatar(): string {
    // Return a fallback icon URL or data URI here
    return 'https://via.placeholder.com/40?text=U'; // example fallback
  }
}