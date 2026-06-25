import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '@services/Company/company.service';
import introJs from 'intro.js';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  companyForm: FormGroup = this.fb.group({});
  logoFile: File | null = null;
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private readonly _companyService: CompanyService,
    private readonly _toastrService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      cnpj: ['', [Validators.maxLength(18)]],
      corporate_reason: ['', [Validators.maxLength(255)]],
      fantasy_name: ['', [Validators.maxLength(255)]],
      street: ['', [Validators.maxLength(255)]],
      number: ['', [Validators.maxLength(20)]],
      complement: ['', [Validators.maxLength(255)]],
      neighborhood: ['', [Validators.maxLength(255)]],
      city: ['', [Validators.maxLength(255)]],
      state: ['', [Validators.maxLength(255)]],
      zipcode: ['', [Validators.maxLength(10)]],
      phone: ['', [Validators.maxLength(255)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      legal_representative_name: ['', [Validators.maxLength(255)]],
      legal_representative_rg: ['', [Validators.maxLength(255)]],
      legal_representative_cpf: ['', [Validators.maxLength(14)]],
      bank: ['', [Validators.maxLength(255)]],
      agency: ['', [Validators.maxLength(255)]],
      checking_account: ['', [Validators.maxLength(255)]],
      logo: ['']
    });

    this.getCompany();
    this.startTour('company');
  }

  getCompany(): void {
    this._companyService.getCompany().subscribe({
      next: (value) => {
        if (value?.data) {
          this.companyForm.patchValue(value.data);
          this.logoPreview = value.data.logo ?? null;
        }
      },
      error: (error) => {
        if (error?.status !== 404) {
          this._toastrService.error('Não foi possível carregar os dados da empresa.');
        }
      }
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.logoFile = null;
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this._toastrService.warning('A logo deve ser uma imagem JPG ou PNG.');
      input.value = '';
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (image.width !== 120 || image.height !== 120) {
        this.logoFile = null;
        input.value = '';
        this._toastrService.warning('A logo deve ter exatamente 120x120 pixels.');
        return;
      }

      this.logoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      this.logoFile = null;
      input.value = '';
      this._toastrService.warning('Não foi possível carregar a imagem da logo.');
    };

    image.src = objectUrl;
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this._toastrService.warning('Confira os campos da empresa antes de salvar.');
      return;
    }

    const payload = this.mountPayload();

    this._companyService.createOrUpdate(payload).subscribe({
      next: (response) => {
        this._toastrService.success(response?.message ?? 'Empresa salva com sucesso!');
        if (response?.data) {
          this.companyForm.patchValue(response.data);
          this.logoPreview = response.data.logo ?? this.logoPreview;
        }
      },
      error: () => {
        this._toastrService.error('Não foi possível salvar os dados da empresa.');
      }
    });
  }

  private mountPayload(): FormData {
    const formData = new FormData();
    const companyData = this.companyForm.value;

    Object.keys(companyData).forEach((key) => {
      if (key === 'logo') {
        return;
      }

      formData.append(key, companyData[key] ?? '');
    });

    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }

    return formData;
  }

  public startTour(tour: string, init = false): void {
    const tourString = localStorage.getItem('tour') ?? '[]';
    const storageTour = JSON.parse(tourString);

    if (init || !storageTour.includes(tour)) {
      const intro = introJs();
      intro.setOptions({
        steps: [
          {
            intro: 'Essa é a página de cadastro e atualização dos dados da empresa.'
          },
          {
            element: '#company-data',
            intro: 'Informe os dados cadastrais da empresa.',
            position: 'left'
          },
          {
            element: '#company-representative',
            intro: 'Preencha os dados do representante legal.',
            position: 'left'
          }
        ],
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        skipLabel: '×',
        doneLabel: 'Concluir'
      });
      intro.start();
      storageTour.push(tour);
      localStorage.setItem('tour', JSON.stringify(storageTour));
    }
  }
}
