import {Component, OnInit} from '@angular/core';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/pt-br';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import {
  CALENDAR_STATUS_OPTIONS,
  CalendarStatusOption,
  CalendarTenderStatus,
  Tender
} from '@model/tender';
import {TenderService} from '@services/tender/tender.service';
import {CalendarTenderModalComponent, CalendarTenderModalResult} from './calendar-tender-modal.component';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';

interface CalendarDay {
  date: Dayjs;
  isCurrentMonth: boolean;
  tenders: Tender[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  protected readonly dayjs = dayjs;
  public statusOptions = CALENDAR_STATUS_OPTIONS;
  public selectedStatus: CalendarTenderStatus | null = null;
  public currentMonth = dayjs().startOf('month');
  public calendarDays: CalendarDay[] = [];
  public tenders: Tender[] = [];
  public isLoading = false;
  public weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  constructor(
    private readonly tenderService: TenderService,
    private readonly _toastrService: ToastrService,
    private readonly dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadCalendar();
  }

  loadCalendar(): void {
    this.isLoading = true;

    this.tenderService.calendar({status: this.selectedStatus ?? ''}).subscribe({
      next: (res) => {
        this.tenders = res?.data ?? [];
        this.mountCalendarDays();
      },
      error: () => {
        this.tenders = [];
        this.mountCalendarDays();
        this._toastrService.error('Não foi possível carregar o calendário.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  previousMonth(): void {
    this.currentMonth = this.currentMonth.subtract(1, 'month');
    this.mountCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = this.currentMonth.add(1, 'month');
    this.mountCalendarDays();
  }

  currentMonthLabel(): string {
    return this.currentMonth.locale('pt-br').format('MMMM [de] YYYY');
  }

  filterByStatus(status: CalendarTenderStatus | null): void {
    this.selectedStatus = this.selectedStatus === status ? null : status;
    this.loadCalendar();
  }

  changeTenderStatus(tender: Tender, status: CalendarTenderStatus): void {
    if (tender.calendar_status === status) {
      return;
    }

    this.tenderService.calendarToggle(tender.id, status).subscribe({
      next: (res) => {
        tender.calendar_status = res?.data?.calendar_status ?? status;

        if (this.selectedStatus && tender.calendar_status !== this.selectedStatus) {
          this.tenders = this.tenders.filter((item) => item.id !== tender.id);
          this.mountCalendarDays();
        }

        this._toastrService.success('Status atualizado com sucesso.');
      },
      error: () => {
        this._toastrService.error('Não foi possível atualizar o status.');
      }
    });
  }

  removeFromCalendar(tender: Tender): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '380px',
      data: {
        text: 'Deseja remover esta licitação do calendário?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.tenderService.calendarToggle(tender.id).subscribe({
        next: () => {
          this.tenders = this.tenders.filter((item) => item.id !== tender.id);
          this.mountCalendarDays();
          this._toastrService.success('Licitação removida do calendário.');
        },
        error: () => {
          this._toastrService.error('Não foi possível remover a licitação do calendário.');
        }
      });
    });
  }

  openTenderModal(tender: Tender): void {
    const dialogRef = this.dialog.open(CalendarTenderModalComponent, {
      width: '720px',
      maxWidth: 'calc(100vw - 28px)',
      data: {
        tender,
        statusOptions: this.statusOptions
      }
    });

    dialogRef.afterClosed().subscribe((result: CalendarTenderModalResult | undefined) => {
      if (!result) {
        return;
      }

      if (result.removed) {
        this.tenders = this.tenders.filter((item) => item.id !== tender.id);
        this.mountCalendarDays();
        return;
      }

      if (result.status) {
        tender.calendar_status = result.status;

        if (this.selectedStatus && tender.calendar_status !== this.selectedStatus) {
          this.tenders = this.tenders.filter((item) => item.id !== tender.id);
        }

        this.mountCalendarDays();
      }
    });
  }

  getStatusOption(status?: CalendarTenderStatus | null): CalendarStatusOption {
    return this.statusOptions.find((option) => option.value === status) ?? this.statusOptions[0];
  }

  private mountCalendarDays(): void {
    const firstDayOfMonth = this.currentMonth.startOf('month');
    const leadingDays = (firstDayOfMonth.day() + 6) % 7;
    const calendarStart = firstDayOfMonth.subtract(leadingDays, 'day');
    const days: CalendarDay[] = [];
    const tendersByDate = this.groupTendersByDate();

    for (let index = 0; index < 42; index++) {
      const date = calendarStart.add(index, 'day');
      const dateKey = date.format('YYYY-MM-DD');

      days.push({
        date,
        isCurrentMonth: date.month() === this.currentMonth.month(),
        tenders: tendersByDate.get(dateKey) ?? []
      });
    }

    this.calendarDays = days;
  }

  private groupTendersByDate(): Map<string, Tender[]> {
    return this.tenders.reduce((acc, tender) => {
      const date = this.getTenderDate(tender);

      if (!date?.isValid()) {
        return acc;
      }

      const key = date.format('YYYY-MM-DD');
      const tenders = acc.get(key) ?? [];
      tenders.push(tender);
      acc.set(key, tenders);

      return acc;
    }, new Map<string, Tender[]>());
  }

  private getTenderDate(tender: Tender): Dayjs | null {
    const date = tender.proposal_closing_date || tender.bid_opening_date || tender.update_date;

    return date ? dayjs(date) : null;
  }
}
