import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProposalCatalog, ProposalCatalogItem} from '@model/proposal';
import {ProposalService} from '@services/Proposal/proposal.service';

@Component({
  selector: 'app-proposal-catalog-view',
  templateUrl: './proposal-catalog-view.component.html',
  styleUrls: ['./proposal-catalog-view.component.scss']
})
export class ProposalCatalogViewComponent implements OnInit {
  public catalogId = 0;
  public catalog: ProposalCatalog | null = null;
  public isLoading = true;
  public editMode = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly proposalService: ProposalService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.catalogId = Number(this.route.snapshot.paramMap.get('catalogId'));
    if (!this.catalogId) {
      this.toastr.error('Catálogo inválido.');
      this.close();
      return;
    }
    this.proposalService.viewCatalog(this.catalogId).subscribe({
      next: (response) => this.catalog = response.data,
      error: (error) => this.toastr.error(this.errorMessage(error)),
      complete: () => this.isLoading = false
    });
  }

  print(): void {
    window.print();
  }

  close(): void {
    if (window.opener) {
      window.close();
      return;
    }
    this.router.navigate(['/painel/proposal-generator']);
  }

  trackByItem(_: number, item: ProposalCatalogItem): number | undefined {
    return item.id;
  }

  private errorMessage(error: any): string {
    return typeof error?.error?.error === 'string' ? error.error.error : 'Não foi possível carregar o catálogo.';
  }
}
