import {Component, Input} from '@angular/core';
import {Tender} from "@model/tender";
import dayjs from "dayjs";

@Component({
  selector: 'app-tender-card',
  templateUrl: './tender-card.component.html',
  styleUrl: './tender-card.component.scss'
})
export class TenderCardComponent {
  @Input()
  data: Tender | null = null;
  protected readonly dayjs = dayjs;
}
