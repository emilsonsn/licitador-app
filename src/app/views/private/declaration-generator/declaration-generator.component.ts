import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Company} from '@model/company';
import {CompanyService} from '@services/Company/company.service';

interface DeclarationTemplate {
  id: string;
  title: string;
  description: string;
  paragraphs: string[];
}

interface DeclarationView {
  template: DeclarationTemplate;
  company: Company;
  form: {
    purchaseNumber: string;
    processNumber: string;
    organName: string;
  };
  date: Date;
}

@Component({
  selector: 'app-declaration-generator',
  templateUrl: './declaration-generator.component.html',
  styleUrls: ['./declaration-generator.component.scss']
})
export class DeclarationGeneratorComponent implements OnInit {
  public declarationForm: FormGroup;
  public company: Company | null = null;
  public selectedDocument: DeclarationView | null = null;
  public isLoadingCompany = false;
  public isDocumentMode = false;

  public templates: DeclarationTemplate[] = [
    {
      id: 'inexistencia-fatos',
      title: 'Declaração de Inexistência',
      description: 'Ausência de fatos impeditivos para habilitação.',
      paragraphs: [
        'Declara, sob as penas da lei, que, até a presente data, não existem quaisquer fatos impeditivos para sua habilitação no processo licitatório em questão, conforme disposto na Lei nº 14133/2021, estando ciente da obrigatoriedade de comunicar imediatamente quaisquer fatos supervenientes que possam alterar a veracidade desta declaração, sob pena de aplicação das sanções legais cabíveis.',
      ],
    },
    {
      id: 'requisitos',
      title: 'Declaração de Requisitos',
      description: 'Cumprimento integral dos requisitos de habilitação.',
      paragraphs: [
        'Declara, sob compromisso formal e sob as penas da lei, que cumpre integralmente os requisitos de habilitação exigidos no edital e seus anexos, nos termos da Lei nº 14133/2021, comprometendo-se a manter todas as condições de habilitação e qualificação exigidas durante toda a vigência do contrato decorrente do certame licitatório.',
      ],
    },
    {
      id: 'nao-menor',
      title: 'Declaração de Não Menor',
      description: 'Atendimento ao artigo 7º, inciso XXXIII, da Constituição Federal.',
      paragraphs: [
        'Declara, em conformidade com o artigo 7º, inciso XXXIII, da Constituição Federal, e com a legislação trabalhista vigente, que não emprega menores de dezoito anos em atividades noturnas, perigosas ou insalubres, bem como não emprega menores de dezesseis anos, salvo na condição de aprendiz, a partir dos quatorze anos, em estrita conformidade com o disposto no artigo 428 da Consolidação das Leis do Trabalho (CLT).',
      ],
    },
    {
      id: 'independente',
      title: 'Declaração de Independente',
      description: 'Elaboração independente da proposta.',
      paragraphs: [
        'Declara, sob as penas da lei, que a proposta apresentada foi elaborada de maneira totalmente independente, sem qualquer interferência, influência ou comunicação prévia com concorrentes ou membros do órgão licitante, nos termos do artigo 299 do Código Penal Brasileiro.',
        'Declara, ainda, que não foi celebrado qualquer acordo, convênio, ajuste ou prática que tenha como objetivo fraudar o caráter competitivo do processo licitatório, conforme disposto na Lei nº 14133/2021.',
      ],
    },
    {
      id: 'micro-pequena',
      title: 'Declaração de Micro e Pequena Empresa',
      description: 'Enquadramento como ME, EPP ou MEI.',
      paragraphs: [
        'Declara que a empresa encontra-se devidamente enquadrada como Microempresa (ME), Empresa de Pequeno Porte (EPP) ou Microempreendedor Individual (MEI), nos termos da Lei Complementar nº 123/2006, e que cumpre integralmente as condições e os requisitos necessários para usufruir dos benefícios previstos nessa legislação, assumindo a responsabilidade pela veracidade das informações prestadas.',
        '□ Microempresa (ME)   □ Empresa de Pequeno Porte (EPP)   □ MEI',
      ],
    },
    {
      id: 'regularidade-fiscal',
      title: 'Declaração de Regularidade Fiscal e Trabalhista',
      description: 'Conformidade fiscal, trabalhista e previdenciária.',
      paragraphs: [
        'Declara, sob as penas da lei, que está em plena conformidade com as obrigações fiscais, trabalhistas e previdenciárias, em especial quanto ao disposto nos artigos 195 e 201 da Constituição Federal, bem como atende aos requisitos de regularidade estabelecidos na Lei nº 14133/2021, estando ciente da obrigatoriedade de manter essa regularidade durante toda a vigência do contrato.',
      ],
    },
    {
      id: 'cumprimento-contrato',
      title: 'Declaração de Responsabilidade pelo Cumprimento do Contrato',
      description: 'Responsabilidade pela execução do objeto contratado.',
      paragraphs: [
        'Declara que possui pleno conhecimento das condições necessárias à execução do objeto contratual, conforme especificado no edital e seus anexos, assumindo integral responsabilidade pelo cumprimento das obrigações assumidas, em conformidade com a Lei nº 14133/2021, comprometendo-se a observar rigorosamente as normas técnicas, legais e contratuais aplicáveis.',
      ],
    },
    {
      id: 'anticorrupcao',
      title: 'Declaração de Atendimento à Lei Anticorrupção',
      description: 'Atendimento à Lei nº 12.846/2013.',
      paragraphs: [
        'Declara, nos termos da Lei nº 12.846/2013 (Lei Anticorrupção), que não pratica, nem permite que sejam praticados, sob sua responsabilidade, atos ilícitos que possam causar danos à Administração Pública nacional ou estrangeira, comprometendo-se a adotar práticas e políticas de integridade, ética e conformidade que garantam o cumprimento das normas legais aplicáveis e dos princípios constitucionais da moralidade e legalidade.',
      ],
    },
    {
      id: 'meio-ambiente',
      title: 'Declaração de Comprometimento com o Meio Ambiente',
      description: 'Conformidade com normas ambientais.',
      paragraphs: [
        'Declara que está em conformidade com as exigências legais e regulamentares vigentes no âmbito ambiental, conforme disposto na Lei nº 6.938/81, que institui a Política Nacional do Meio Ambiente, comprometendo-se a adotar todas as medidas necessárias para garantir a preservação ambiental e o atendimento às condições estabelecidas nos licenciamentos e autorizações pertinentes, sob pena de responsabilização civil, administrativa e penal.',
      ],
    },
    {
      id: 'sem-servidor-societario',
      title: 'Declaração de Não Possuir Servidor Público Ativo no Quadro Societário',
      description: 'Ausência de servidor público ativo no quadro societário.',
      paragraphs: [
        'Declara, para os fins de atendimento ao disposto na Lei nº 14133/2021, que não possui, em seu quadro societário, servidor público da ativa, direta ou indiretamente vinculado ao órgão contratante, estando plenamente ciente das implicações legais decorrentes da inobservância desta disposição legal.',
      ],
    },
    {
      id: 'nepotismo-impedimentos',
      title: 'Declaração de Inexistência de Nepotismo e Impedimentos',
      description: 'Ausência de nepotismo, impedimentos e vínculos vedados.',
      paragraphs: [
        'Declara, sob as penas da lei, para os devidos fins, que:',
        'I – Não possui, em seu quadro societário, dirigente, administrador, sócio ou representante legal que mantenha vínculo de parentesco, em linha reta ou colateral, por consanguinidade ou afinidade, até o terceiro grau, com agentes públicos, servidores ou autoridades responsáveis pela condução, julgamento, fiscalização ou contratação do presente processo licitatório.',
        'II – Não possui qualquer fato impeditivo que comprometa sua participação no presente certame, estando plenamente apta a contratar com a Administração Pública, nos termos da legislação vigente.',
        'III – Não emprega agentes públicos ou pessoas legalmente impedidas de exercer atividades relacionadas ao objeto desta licitação.',
        'IV – Compromete-se a comunicar imediatamente qualquer fato superveniente que venha a alterar as informações aqui prestadas.',
        'Declara, ainda, estar ciente de que a falsidade desta declaração sujeitará a empresa às penalidades previstas na legislação aplicável.',
        'Por ser expressão da verdade, firma a presente declaração para todos os fins legais.',
      ],
    },
    {
      id: 'unificada',
      title: 'Declaração Unificada',
      description: 'Modelo consolidado com declarações legais recorrentes.',
      paragraphs: [
        'Declara para os devidos fins que:',
        '1. Declaração sobre Trabalho de Menores (CF/88, art. 7º, XXXIII)\nA empresa não emprega menor de 18 anos em trabalho noturno, perigoso ou insalubre, nem menor de 16 anos em qualquer trabalho, salvo na condição de aprendiz a partir de 14 anos.',
        '2. Declaração de Ausência de Impedimento para Habilitação (Lei 14.133/2021, art. 63, §6º)\nAté a presente data, não existem fatos impeditivos à participação ou habilitação da empresa, comprometendo-se a comunicar eventuais ocorrências supervenientes.',
        '3. Declaração de Não Impedimento ou Sanção (Lei 14.133/2021, art. 156)\nA empresa declara que não está impedida de licitar ou contratar com a Administração Pública, não foi declarada inidônea por qualquer órgão ou entidade da administração pública, não está suspensa de contratar e não possui sanções vigentes que a impeçam de participar do certame.',
        '4. Declaração de Ausência de Vínculo com Servidores do Órgão Contratante (Lei 14.133/2021, art. 14)\nA empresa declara que não possui, em seu quadro societário ou de empregados, servidor, dirigente, agente público ou responsável pela licitação que configure impedimento legal.',
        '5. Declaração como ME/EPP (quando aplicável)\nCaso enquadrada, declara ser Microempresa (ME) ou Empresa de Pequeno Porte (EPP), atendendo aos requisitos da Lei Complementar 123/2006, e que não se enquadra nas vedações previstas no §4º do art. 3º.',
        '6. Declaração de Atendimento ao Edital\nA empresa declara que conhece integralmente o instrumento convocatório e seus anexos, aceita todas as condições estabelecidas, possui plena capacidade técnica, operacional e jurídica para executar o objeto licitado e satisfaz todas as exigências de habilitação previstas no edital.',
        '7. Declaração de Veracidade\nTodos os dados e declarações aqui apresentados são verdadeiros, assumindo a empresa integral responsabilidade civil, administrativa e penal pelas informações prestadas.',
      ],
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly companyService: CompanyService,
    private readonly toastr: ToastrService,
  ) {
    this.declarationForm = this.fb.group({
      organName: ['', Validators.required],
      purchaseNumber: ['', Validators.required],
      processNumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCompany();
  }

  public openDocument(template: DeclarationTemplate): void {
    if (this.declarationForm.invalid) {
      this.declarationForm.markAllAsTouched();
      this.toastr.warning('Preencha órgão, número da compra e número do processo.');
      return;
    }

    if (!this.company) {
      this.toastr.warning('Cadastre os dados da empresa antes de gerar declarações.');
      return;
    }

    this.selectedDocument = {
      template,
      company: this.company,
      form: this.declarationForm.value,
      date: new Date(),
    };
    this.isDocumentMode = true;
  }

  public backToGenerator(): void {
    this.isDocumentMode = false;
  }

  public printDocument(): void {
    const documentElement = document.getElementById('declaration-document');

    if (!documentElement) {
      this.toastr.warning('Abra uma declaração antes de baixar.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1024,height=768');

    if (!printWindow) {
      this.toastr.error('Não foi possível abrir a janela de impressão.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(this.printableHtml(documentElement.innerHTML));
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
  }

  public getCompanyName(company: Company | null = this.company): string {
    return company?.corporate_reason || company?.fantasy_name || 'Empresa não cadastrada';
  }

  public getCompanyAddress(company: Company | null = this.company): string {
    if (!company) {
      return '';
    }

    const firstLine = [
      company.street,
      company.number,
      company.complement,
      company.neighborhood,
    ].filter(Boolean).join(', ');

    const cityLine = [
      company.city,
      company.state,
    ].filter(Boolean).join('/');

    return [
      firstLine,
      cityLine,
      company.zipcode ? `CEP: ${company.zipcode}` : '',
    ].filter(Boolean).join(' - ');
  }

  private loadCompany(): void {
    this.isLoadingCompany = true;

    this.companyService.getCompany().subscribe({
      next: (response) => this.company = response?.data ?? null,
      error: () => this.toastr.warning('Cadastre sua empresa para gerar declarações.'),
      complete: () => this.isLoadingCompany = false,
    });
  }

  private printableHtml(documentHtml: string): string {
    return `
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <title>Declaração</title>
          <style>
            @page { size: A4; margin: 14mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              color: #111;
              background: #fff;
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.45;
            }
            .declaration-document {
              width: 100%;
              margin: 0;
              padding: 0;
              border: 0;
              background: #fff;
            }
            .company-header {
              display: grid;
              grid-template-columns: 72px 1fr;
              gap: 18px;
              align-items: start;
              margin-bottom: 36px;
            }
            .logo-box {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              height: 64px;
              border: 1px solid #d9dde5;
              font-weight: 700;
            }
            .company-header p,
            .document-meta p,
            .signature p {
              margin: 3px 0;
            }
            .document-meta {
              margin-bottom: 22px;
            }
            h1 {
              margin: 0 0 18px;
              font-size: 16px;
              text-align: left;
            }
            .company-text {
              margin-bottom: 18px;
            }
            .body-paragraph {
              margin: 0 0 13px;
              text-align: justify;
              white-space: pre-line;
            }
            .signature {
              margin-top: 56px;
              text-align: center;
            }
            .signature strong,
            .signature span {
              display: block;
            }
          </style>
        </head>
        <body>
          <article class="declaration-document">${documentHtml}</article>
        </body>
      </html>
    `;
  }
}
