import {Component, EventEmitter, forwardRef, Input, Output, HostListener, ElementRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

type InputTypes = 'text' | 'number' | 'password' | 'email' | 'tel' | 'select' | 'multiselect';

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
  @Input() messageError: string = '';
  @Input() error: boolean = false;
  @Input() errorInput: boolean = false;
  @Input() options: { value: string, label: string }[] = [];
  @Output() onClick = new EventEmitter();
  @Output() selectionChange = new EventEmitter<{ value: string, label: string }[]>();

  isDropdownOpen: boolean = false;
  selectedOptions: Set<string> = new Set();
  searchText: string = '';

  value: string = '';
  control = new FormControl(this.value);

  click() {
    this.onClick.emit();
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.control.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  onSelectChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.control.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  onMultiselectToggle(option: string) {
    if (this.selectedOptions.has(option)) {
      this.selectedOptions.delete(option);
    } else {
      this.selectedOptions.add(option);
    }
    this.updateValue();
  }

  updateValue() {
    const selectedOptionsArray = Array.from(this.selectedOptions).map(value => {
      return this.options.find(option => option.value === value);
    }).filter(option => option !== undefined) as { value: string, label: string }[];

    this.value = selectedOptionsArray.map(option => option.label).join(', ');
    this.control.setValue(this.value);
    this.onChange(this.value);
    this.onTouched();
    this.selectionChange.emit(selectedOptionsArray);
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.value = value;
      this.control.setValue(value);
      this.selectedOptions = new Set(value.split(', '));
    }
  }

  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  get filteredOptions() {
    const normalizedSearchText = this.normalizeText(this.searchText).toLowerCase();
    return this.options.filter(option =>
      this.normalizeText(option.label).toLowerCase().includes(normalizedSearchText)
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.isDropdownOpen) return;

    // Check if the clicked element is outside the component
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  constructor(private elementRef: ElementRef) {}
}
