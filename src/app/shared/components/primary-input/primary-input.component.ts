import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

type InputTypes = 'text' | 'number' | 'password' | 'email' | 'tel';

@Component({
  selector: 'app-primary-input',
  templateUrl: './primary-input.component.html',
  styleUrls: ['./primary-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ]
})
export class PrimaryInputComponent implements ControlValueAccessor {
  @Input() type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() inputName: string = '';
  @Input() label: string = '';
  @Input() cursor: string = '';

  value: string = '';
  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };

  onInput(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
