import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ui5InputComponent } from '../../ui5-input/ui5-input';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [Ui5InputComponent, FormsModule],
  template: `
    <div class="flex flex-col gap-[20px]">
      <label class="text-[14px] leading-none">
        To reset your password, enter your email and continue.
      </label>

      <label for="email" class="flex flex-col w-full">
        Email:
        <app-ui5-input
          [(ngModel)]="email"
          (ngModelChange)="emailChange.emit($event)"
          placeholder="Email"
          class="w-full h-[26px]"
          [required]="true"
          name="email"
        ></app-ui5-input>
      </label>
    </div>
  `,
})
export class ForgotPasswordFormComponent {
  @Input() email: string = '';
  @Output() emailChange = new EventEmitter<string>();
  @Output() emailSubmitted = new EventEmitter<string>();
  @Output() backToLogin = new EventEmitter<void>();

  submit() {
    this.emailSubmitted.emit(this.email);
  }
}
