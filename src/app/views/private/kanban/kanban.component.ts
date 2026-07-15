import {Component, OnInit} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import dayjs from 'dayjs';
import {ToastrService} from 'ngx-toastr';
import {CALENDAR_STATUS_OPTIONS, CalendarStatusOption, CalendarTenderStatus, Tender} from '@model/tender';
import {TenderService} from '@services/tender/tender.service';
import {
  CalendarTenderModalComponent,
  CalendarTenderModalResult
} from '../calendar/calendar-tender-modal.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  protected readonly dayjs = dayjs;
  public readonly statusOptions = CALENDAR_STATUS_OPTIONS;
  public tenders: Tender[] = [];
  public isLoading = false;

  constructor(
    private readonly tenderService: TenderService,
    private readonly dialog: MatDialog,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTenders();
  }

  loadTenders(): void {
    this.isLoading = true;
    this.tenderService.calendar().subscribe({
      next: (res) => this.tenders = res?.data ?? [],
      error: () => {
        this.tenders = [];
        this.toastr.error('Não foi possível carregar o Kanban.');
      },
      complete: () => this.isLoading = false
    });
  }

  tendersByStatus(status: CalendarTenderStatus): Tender[] {
    return this.tenders.filter((tender) => tender.calendar_status === status);
  }

  columnId(status: CalendarTenderStatus): string {
    return `kanban-${status}`;
  }

  connectedColumns(status: CalendarTenderStatus): string[] {
    return this.statusOptions
      .filter((option) => option.value !== status)
      .map((option) => this.columnId(option.value));
  }

  drop(event: CdkDragDrop<Tender[]>, status: CalendarTenderStatus): void {
    const tender = event.item.data as Tender;
    const previousStatus = tender.calendar_status;

    if (!tender || previousStatus === status) {
      return;
    }

    tender.calendar_status = status;
    this.tenderService.calendarToggle(tender.id, status).subscribe({
      next: (res) => {
        tender.calendar_status = res?.data?.calendar_status ?? status;
        this.toastr.success('Status atualizado com sucesso.');
      },
      error: () => {
        tender.calendar_status = previousStatus;
        this.toastr.error('Não foi possível atualizar o status.');
      }
    });
  }

  openTender(tender: Tender): void {
    const dialogRef = this.dialog.open(CalendarTenderModalComponent, {
      width: '720px',
      maxWidth: 'calc(100vw - 28px)',
      maxHeight: 'calc(100vh - 28px)',
      data: {tender, statusOptions: this.statusOptions}
    });

    dialogRef.afterClosed().subscribe((result: CalendarTenderModalResult | undefined) => {
      if (!result) {
        return;
      }

      if (result.removed) {
        this.tenders = this.tenders.filter((item) => item.id !== tender.id);
        return;
      }

      if (result.status) {
        tender.calendar_status = result.status;
      }

      if (result.calendarDate !== undefined) {
        tender.calendar_date = result.calendarDate;
      }
    });
  }

  trackByTender(_: number, tender: Tender): number {
    return tender.id;
  }

  trackByStatus(_: number, status: CalendarStatusOption): CalendarTenderStatus {
    return status.value;
  }
}
