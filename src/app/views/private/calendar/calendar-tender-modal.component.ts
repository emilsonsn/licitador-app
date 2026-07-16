import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import dayjs from 'dayjs';
import {ToastrService} from 'ngx-toastr';
import {CalendarStatusOption, CalendarTenderStatus, Tender} from '@model/tender';
import {TenderService} from '@services/tender/tender.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogConfirmComponent} from '@shared/dialogs/dialog-confirm/dialog-confirm.component';

interface CalendarTenderModalData {
  tender: Tender;
  statusOptions: CalendarStatusOption[];
}

export interface CalendarTenderModalResult {
  status?: CalendarTenderStatus;
  calendarDate?: string | null;
  removed?: boolean;
}

@Component({
  selector: 'app-calendar-tender-modal',
  templateUrl: './calendar-tender-modal.component.html',
  styleUrls: ['./calendar-tender-modal.component.scss']
})
export class CalendarTenderModalComponent {
  protected readonly dayjs = dayjs;
  public isSaving = false;
  public calendarDate = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CalendarTenderModalData,
    private readonly dialogRef: MatDialogRef<CalendarTenderModalComponent, CalendarTenderModalResult>,
    private readonly tenderService: TenderService,
    private readonly _toastrService: ToastrService,
    private readonly dialog: MatDialog
  ) {
    this.calendarDate = this.toDateTimeLocal(this.data.tender.calendar_date);
  }

  saveCalendarDate(): void {
    if (this.isSaving) {
      return;
    }

    const calendarDate = this.calendarDate ? dayjs(this.calendarDate).format('YYYY-MM-DD HH:mm:ss') : null;
    this.isSaving = true;

    this.tenderService.calendarToggle(this.tender.id, undefined, calendarDate).subscribe({
      next: (res) => {
        const savedDate = res?.data?.calendar_date ?? calendarDate;
        this.tender.calendar_date = savedDate;
        this._toastrService.success('Data atualizada com sucesso.');
        this.dialogRef.close({calendarDate: savedDate});
      },
      error: () => this._toastrService.error('Não foi possível atualizar a data.'),
      complete: () => this.isSaving = false
    });
  }

  get tender(): Tender {
    return this.data.tender;
  }

  get statusOptions(): CalendarStatusOption[] {
    return this.data.statusOptions;
  }

  changeStatus(status: CalendarTenderStatus): void {
    if (this.tender.calendar_status === status || this.isSaving) {
      return;
    }

    this.isSaving = true;

    this.tenderService.calendarToggle(this.tender.id, status).subscribe({
      next: (res) => {
        const calendarStatus = res?.data?.calendar_status ?? status;
        this.tender.calendar_status = calendarStatus;
        this._toastrService.success('Status atualizado com sucesso.');
        this.dialogRef.close({status: calendarStatus});
      },
      error: () => {
        this._toastrService.error('Não foi possível atualizar o status.');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  removeFromCalendar(): void {
    if (this.isSaving) {
      return;
    }

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

      this.isSaving = true;

      this.tenderService.calendarToggle(this.tender.id).subscribe({
        next: () => {
          this._toastrService.success('Licitação removida do calendário.');
          this.dialogRef.close({removed: true});
        },
        error: () => {
          this._toastrService.error('Não foi possível remover a licitação do calendário.');
        },
        complete: () => {
          this.isSaving = false;
        }
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private toDateTimeLocal(date?: string | null): string {
    return date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DDTHH:mm') : '';
  }
}
