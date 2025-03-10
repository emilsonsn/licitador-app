import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  SimpleChanges
} from '@angular/core';
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
  @Input() fill: boolean = false;
  @Input() options: { value: string, label: string, sigla?: string }[] = [];
  @Input() returnArrayType: 'value' | 'label' | 'sigla' = 'label'; // Definido para retornar valores ou labels
  @Output() onClick = new EventEmitter();
  @Output() selectionChange = new EventEmitter<{ value: string, label: string }[]>();

  isDropdownOpen: boolean = false;
  selectedOptions: Set<string> = new Set();
  searchText: string = '';
  displayText: string = '';
  selectedOption: string = '';
  control = new FormControl(this.displayText);

  click() {
    this.onClick.emit();
  }

  onChange: (value: any) => void = () => {
  };
  onTouched: () => void = () => {
  };

  ngOnChanges(changes: SimpleChanges): void {    
    const { fill } = changes;
    if (fill && fill.currentValue !== fill.previousValue) {
      this.fillTenderForm()
    }
  }

  fillTenderForm(): void {
    if (this.value && this.returnArrayType === 'sigla') {
      const _value = this.options.find(option => option.sigla === this.value) as {
        value: string,
        label: string,
        sigla: string
      };
      this.onSelectOption(_value.value);
    } else if (this.value && this.type === 'multiselect') {
      if (Array.isArray(this.value)) {
        this.value.forEach(v => this.onMultiselectToggle(v));
      } else {
        const values = this.value.split(",");
        values.forEach(v => {
          if (isNaN(Number(v))) {
            const selectedOption = this.options.find(option => option.label === v) as {
              value: string,
              label: string,
              sigla: string
            };
            if(selectedOption) this.onMultiselectToggle(selectedOption.value);
          }
        });
      }
    }
    this.fill = false;
  }

  onSelectOption(value: string) {
    this.selectedOption = value;
    const selectedOption =
      this.options.find(option => option.value === value) as { value: string, label: string, sigla: string };

    // Atualizar displayText com base na opção selecionada
    this.displayText = selectedOption ? selectedOption.label : '';
    this.control.setValue(this.displayText);

    // Atualizar e emitir o valor baseado na sigla se for o caso
    if (this.returnArrayType === 'sigla' && selectedOption) {
      this.control.setValue(selectedOption.sigla);
    } else {
      this.control.setValue(this.displayText);
    }

    this.onChange(this.control.value);
    this.onTouched();

    // Emitir o array com a opção selecionada, incluindo a sigla se disponível
    this.selectionChange.emit(selectedOption ? [selectedOption] : []);

    this.isDropdownOpen = false;
  }

  onInput(event: any) {
    const value = (event.target as HTMLInputElement).value;
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

    this.displayText = selectedOptionsArray.map(option => option.label).join(',');
  }

  updateValue() {
    const selectedOptionsArray = Array.from(this.selectedOptions).map(value => {
      return this.options.find(option => option.value === value);
    }).filter(option => option !== undefined) as { value: string, label: string, sigla: string }[];

    if (this.returnArrayType === 'sigla') {
      this.control.setValue(selectedOptionsArray.map(option => option.sigla).join(','));
    } else if (this.returnArrayType === 'value') {
      this.control.setValue(selectedOptionsArray.map(option => option.value).join(','));
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
      const valuesArray = value.split(',');      
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
