import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ui5InputComponent } from '../../ui5-input/ui5-input';

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-login-form',
  standalone: true,
  imports: [Ui5InputComponent, FormsModule],
  template: `
    <!-- <div> -->
    <div class="flex flex-col gap-[20px]">
      <label class="flex flex-col w-full">
        Username or email:
        <app-ui5-input
          [(ngModel)]="email"
          (ngModelChange)="emailChange.emit($event)"
          placeholder="Username or Email"
          class="w-full h-[26px]"
          [required]="true"
          name="loginId"
        ></app-ui5-input>
      </label>
      <!-- </div> -->
      <label class="flex flex-col w-full">
        Password:
        <app-ui5-input
          [(ngModel)]="password"
          (ngModelChange)="passwordChange.emit($event)"
          [type]="passwordVisible ? 'text' : 'Password'"
          placeholder="Password"
          class="w-full h-[26px]"
          name="password"
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
        <span
          class="block w-full text-sm text-[#0064D9] text-right p-[8px] gap-[50px]"
          style="cursor: pointer"
          (click)="forgot.emit()"
        >
          Forget Password?
        </span>
      </label>
    </div>
  `,
})
export class LoginFormComponent {
  // @Input() username: string = '';
  @Input() email: string = '';
  @Input() password: string = '';
  @Input() passwordVisible: boolean = false;

  // @Output() usernameChange = new EventEmitter<string>();
  @Output() emailChange = new EventEmitter<string>();
  @Output() passwordChange = new EventEmitter<string>();
  @Output() toggleVisibility = new EventEmitter<void>();
  @Output() forgot = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
}
