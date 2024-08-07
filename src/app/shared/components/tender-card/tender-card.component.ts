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

  constructor(private readonly tenderService: TenderService) {
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
