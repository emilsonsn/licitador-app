import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Tender} from "@model/tender";
import dayjs from "dayjs";
import {TenderService} from "@services/tender/tender.service";
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tender-card',
  templateUrl: './tender-card.component.html',
  styleUrl: './tender-card.component.scss'
})
export class TenderCardComponent {
  @Input()
  data: Tender | null = null;
  protected readonly dayjs = dayjs;
  protected readonly length = length;
  viewedPlus: boolean = false;
  viewItems: boolean = false;
  noteText: FormControl = new FormControl('');

  @Input()
  isLoading = false;

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  constructor(
    private readonly tenderService: TenderService,
    private readonly _toastrService: ToastrService
  ) {
  }

  truncate(str: string | null | undefined, maxChars: number): string {
    if (!str) {
      return '';
    }
    if (str.length <= maxChars) {
      return str;
    }
    return str.slice(0, maxChars) + '...';
  }


  formatUrl(url: string | null | undefined): string {
    if (typeof url === 'string') {
      // Adiciona 'https://' se a URL não começar com 'http://' ou 'https://'
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    }
    return '';
  }

  getEdital(id: any){
    this.tenderService.edital(id).subscribe(res => {
      if(res?.data?.length){
        res.data.forEach((url: string) => {
          window.open(url, '_blank');
        });
      }else{
        this._toastrService.error('Edital não encontrado');
      }
    });
  }

  openUrlOrigin(url: string){
    if(url){
      window.open(url, '_blank');
    } else{
      this._toastrService.error('Site de origem não encontrado');
    }
  }

  viewMore() {
    this.viewedPlus = !this.viewedPlus;
  }

  onViewItems() {
    this.viewItems = !this.viewItems;
  }
  
  note(tender_id: any){
    const text = this.noteText.value;
    var note = {tender_id, note: text};
    this.tenderService.note(note)
    .subscribe({
      next: () => {
        this._toastrService.success('Nota adicionada com sucesso');
        this.data?.notes.push({tender_id, note: text})
        this.noteText.setValue('');
      },
      error: () => {
        this._toastrService.error('Não foi possível adicionar a nota');
      }
    });
  }

  deletenote(noteId: any){
    const text = this.noteText.value;
    this.tenderService.noteDelete(noteId)
    .subscribe({
      next: () => {
        this._toastrService.success('Nota deletada com sucesso');
        if (this.data && this.data.notes) {
          this.data.notes = this.data.notes.filter(note => note.id !== noteId);
        }
        this.loading.emit(!this.isLoading);
      },
      error: () => {
        this._toastrService.error('Não foi possível deletar a nota');
      }
    });
  }

  

  favorite(data: Tender | null) {
    if (!data) {
      return;
    }
    this.tenderService.favorite(data?.id).subscribe({
      next: () => {
        if (data.favorites.length > 0) {
          data.favorites.pop();
        } else {
          data.favorites.push(1);
        }
      }
    });
  }
}
