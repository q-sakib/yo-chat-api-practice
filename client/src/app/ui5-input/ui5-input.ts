import {
  Component,
  forwardRef,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  Attribute,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import '@ui5/webcomponents/dist/Input';

@Component({
  selector: 'app-ui5-input',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ui5-input.html',
  styleUrls: ['./ui5-input.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ui5InputComponent),
      multi: true,
    },
  ],
})
export class Ui5InputComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() type: string = 'Text';
  @Input() disabled = false;
  @Input() name?: string;
  @Input() id?: string;
  @Input() maxlength?: number;
  @Input() autocomplete?: string;
  @Input() required = false;

  // Forwarded from the parent <app-ui5-input class="...">
  @Input() class = '';
  @Input() style = '';

  value: string = '';

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
