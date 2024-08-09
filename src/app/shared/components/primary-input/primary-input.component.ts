import {Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';

type InputTypes = 'text' | 'number' | 'password' | 'email' | 'tel' | 'select' | 'multiselect' | 'date';

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
  @Input() value: string = '';
  @Input() options: { value: string, label: string }[] = [];
  @Input() returnArrayType: 'value' | 'label' | 'sigla' = 'label'; // Definido para retornar valores ou labels
  @Output() onClick = new EventEmitter();
  @Output() selectionChange = new EventEmitter<{ value: string, label: string }[]>();

  isDropdownOpen: boolean = false;
  selectedOptions: Set<string> = new Set();
  searchText: string = '';
  selectedValue: any;
  selectedOptionLabel = '';
  displayText: string = ''; // Usado para mostrar os labels selecionados
  control = new FormControl(this.displayText);

  click() {
    this.onClick.emit();
  }

  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };

  onInput(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.displayText = value;
    this.control.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSelectChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.displayText = value;
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
    this.updateDisplayText();
    this.updateValue();
  }

  updateDisplayText() {
    const selectedOptionsArray = Array.from(this.selectedOptions).map(value => {
      return this.options.find(option => option.value === value);
    }).filter(option => option !== undefined) as { value: string, label: string }[];

    this.displayText = selectedOptionsArray.map(option => option.label).join(', ');
  }

  onOptionSelect(value: any) {
    this.selectedValue = value;
    this.selectedOptionLabel = this.options.find(option => option.value === value)?.label || '';
    this.isDropdownOpen = false;
    this.onSelectChange(value); // Caso você tenha uma função para lidar com a mudança
  }

  updateValue() {
    const selectedOptionsArray = Array.from(this.selectedOptions).map(value => {
      return this.options.find(option => option.value === value);
    }).filter(option => option !== undefined) as { value: string, label: string, sigla: string }[];

    if (this.returnArrayType === 'sigla') {
      this.control.setValue(selectedOptionsArray.map(option => option.sigla).join(', '));
    } else if (this.returnArrayType === 'value') {
      this.control.setValue(selectedOptionsArray.map(option => option.value).join(', '));
    } else {
      this.control.setValue(this.displayText);
    }

    this.onChange(this.control.value);
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
    if (typeof value === 'string' && value !== '') {
      const valuesArray = value.split(', ');
      this.selectedOptions = new Set(valuesArray);
    } else {
      this.selectedOptions = new Set();
    }

    this.updateDisplayText();
    this.control.setValue(this.displayText);
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

  constructor(private elementRef: ElementRef) {
  }
}
