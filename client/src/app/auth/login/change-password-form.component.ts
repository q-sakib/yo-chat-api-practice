import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ui5InputComponent } from '../../ui5-input/ui5-input';

@Component({
  selector: 'app-change-password-form',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  standalone: true,
  imports: [Ui5InputComponent, FormsModule],
  template: `
    <div class="flex flex-col gap-[20px] w-full">
      <label for="newPassword" class="flex flex-col w-full text-sm">
        New Password:
        <app-ui5-input
          [type]="passwordVisible ? 'text' : 'Password'"
          [(ngModel)]="newPassword"
          (ngModelChange)="newPasswordChange.emit($event)"
          placeholder="New password"
          name="newPassword"
          class="w-full h-[26px]"
          [required]="true"
        >
          <ui5-icon
            slot="icon"
            [name]="passwordVisible ? 'hide' : 'show'"
            class="cursor-pointer"
            style="
            width: 16px;
            height: 16px;
            border-radius: 4px;
            padding: 5px 8px;
            gap: 4px;
            color: #0064D9;"
            (click)="toggleVisibility.emit()"
          ></ui5-icon>


        </app-ui5-input>
      </label>

      <label for="confirmPassword" class="flex flex-col w-full text-sm">
        Confirm password:
        <app-ui5-input
          [(ngModel)]="confirmPassword"
          (ngModelChange)="confirmPasswordChange.emit($event)"
          placeholder="Password"
          name="confirmPassword"
          [type]="passwordVisible ? 'text' : 'Password'"
          class="w-full h-[26px]"
          [required]="true"
        >
          <ui5-icon
            slot="icon"
            [name]="passwordVisible ? 'hide' : 'show'"
            class="cursor-pointer"
            style="
            width: 16px;
            height: 16px;
            border-radius: 4px;
            padding: 5px 8px;
            gap: 4px;
            color: #0064D9;"
            (click)="toggleVisibility.emit()"
          ></ui5-icon>
        </app-ui5-input>
      </label>
    </div>
  `,
})
export class ChangePasswordFormComponent {
  @Input() password: string = '';
  @Input() newPassword: string = '';
  @Input() confirmPassword: string = '';

  @Input() passwordVisible: boolean = false;

  @Output() newPasswordChange = new EventEmitter<string>();
  @Output() confirmPasswordChange = new EventEmitter<string>();

  @Output() toggleVisibility = new EventEmitter<void>();

  @Output() submit = new EventEmitter<void>();
  @Output() backToLogin = new EventEmitter<void>();
}
