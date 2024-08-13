import {Component, Input} from '@angular/core';
import {Tender} from "@model/tender";
import dayjs from "dayjs";
import {TenderService} from "@services/tender/tender.service";

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

  constructor(private readonly tenderService: TenderService) {
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
      }
    });
  }

  viewMore() {
    this.viewedPlus = !this.viewedPlus;
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
