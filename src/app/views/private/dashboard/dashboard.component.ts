import {Component, OnDestroy, OnInit} from '@angular/core';
import {Chart, ChartConfiguration, registerables} from 'chart.js';
import {DashboardService} from '@services/Dashboard/dashboard.service';

type DashboardTab = 'tenders' | 'users';

interface DashboardMetric {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  tone: string;
}

interface DistributionItem {
  label: string;
  value: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  totalMonthUsers = 0;
  totalActiveUsers = 0;
  totalInactiveUsers = 0;
  totalTenders = 0;
  totalMonthTenders = 0;
  totalDayTenders = 0;
  displayedTenders = 0;
  confidentialTenders = 0;
  tendersWithValue = 0;
  averageTenderValue = 0;
  totalTenderValue = 0;

  userMetrics: DashboardMetric[] = [];
  tenderMetrics: DashboardMetric[] = [];
  sourceDistribution: DistributionItem[] = [];
  ufDistribution: DistributionItem[] = [];
  cityDistribution: DistributionItem[] = [];
  modalityDistribution: DistributionItem[] = [];
  statusDistribution: DistributionItem[] = [];

  activeTab: DashboardTab = 'tenders';
  isLoadingDashboard = false;
  isLoadingTenders = false;

  private userGrowthChart?: Chart;
  private tendersBySourceChart?: Chart;
  private tendersByUfChart?: Chart;
  private userGraphData: any[] = [];
  private dashboardRequestId = 0;

  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.loadDashboardData();
    this.loadUserGraphData();
  }

  ngOnDestroy(): void {
    this.userGrowthChart?.destroy();
    this.tendersBySourceChart?.destroy();
    this.tendersByUfChart?.destroy();
  }

  loadDashboardData(): void {
    const requestId = ++this.dashboardRequestId;

    this.isLoadingDashboard = true;
    this.isLoadingTenders = true;

    this.dashboardService.getIndicators().subscribe({
      next: (response) => {
        if (requestId !== this.dashboardRequestId) {
          return;
        }

        if (response.status) {
          const users = response.data?.users ?? {};
          const tenders = response.data?.tenders ?? {};
          const distributions = response.data?.distributions ?? {};

          this.totalUsers = users.totalUsers ?? 0;
          this.totalMonthUsers = users.totalMonthUsers ?? 0;
          this.totalActiveUsers = users.totalActiveUsers ?? 0;
          this.totalInactiveUsers = users.totalInactiveUsers ?? 0;
          this.totalTenders = tenders.totalTenders ?? 0;
          this.displayedTenders = tenders.totalTenders ?? 0;
          this.totalDayTenders = tenders.totalDayTenders ?? 0;
          this.totalMonthTenders = tenders.totalMonthTenders ?? 0;
          this.tendersWithValue = tenders.tendersWithValue ?? 0;
          this.confidentialTenders = tenders.confidentialTenders ?? 0;
          this.totalTenderValue = Number(tenders.totalTenderValue ?? 0);
          this.averageTenderValue = Number(tenders.averageTenderValue ?? 0);
          this.sourceDistribution = this.withPercent(distributions.sources ?? []);
          this.ufDistribution = this.withPercent(distributions.ufs ?? []);
          this.cityDistribution = this.withPercent(distributions.cities ?? [], this.displayedTenders);
          this.modalityDistribution = this.withPercent(distributions.modalities ?? [], this.displayedTenders);
          this.statusDistribution = this.withPercent(distributions.statuses ?? [], this.displayedTenders);
          this.buildUserMetrics();
          this.buildTenderMetrics();
          if (this.activeTab === 'tenders') {
            this.renderTenderCharts();
          }
        } else {
          console.error('Error fetching dashboard data:', response.error);
        }
      },
      error: (error) => {
        if (requestId === this.dashboardRequestId) {
          console.error('Error fetching dashboard data:', error);
        }
      },
      complete: () => {
        if (requestId === this.dashboardRequestId) {
          this.isLoadingDashboard = false;
          this.isLoadingTenders = false;
        }
      },
    });
  }

  loadUserGraphData(): void {
    this.dashboardService.getUserGraph({period: 'annual'}).subscribe(response => {
      if (response.status) {
        this.userGraphData = response.data ?? [];

        if (this.activeTab === 'users') {
          this.renderUserGrowthChart();
        }
      } else {
        console.error('Error fetching user graph data:', response.error);
      }
    });
  }

  setActiveTab(tab: DashboardTab): void {
    this.activeTab = tab;

    setTimeout(() => {
      if (tab === 'tenders') {
        this.renderTenderCharts();
      } else {
        this.renderUserGrowthChart();
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  formatPercent(value: number): string {
    return `${Math.round(value)}%`;
  }

  private buildTenderMetrics(): void {
    this.tenderMetrics = [
      {
        title: 'Total de licitações',
        value: this.displayedTenders,
        description: 'Total cadastrado na base',
        icon: 'fa-solid fa-file-lines',
        tone: 'green',
      },
      {
        title: 'Entraram hoje',
        value: this.totalDayTenders,
        description: 'Criadas hoje na base',
        icon: 'fa-solid fa-calendar-day',
        tone: 'blue',
      },
      {
        title: 'Licitações no mês',
        value: this.totalMonthTenders,
        description: 'Volume mensal da base',
        icon: 'fa-solid fa-arrow-trend-up',
        tone: 'orange',
      },
      {
        title: 'Valor médio',
        value: this.formatCurrency(this.averageTenderValue),
        description: `${this.tendersWithValue} licitações com valor informado`,
        icon: 'fa-solid fa-chart-line',
        tone: 'purple',
      },
      {
        title: 'Valor estimado',
        value: this.formatCurrency(this.totalTenderValue),
        description: 'Soma da amostra filtrada',
        icon: 'fa-solid fa-sack-dollar',
        tone: 'teal',
      },
      {
        title: 'Valor sigiloso',
        value: this.confidentialTenders,
        description: 'Licitações sem valor público',
        icon: 'fa-solid fa-eye-slash',
        tone: 'red',
      },
    ];
  }

  private buildUserMetrics(): void {
    this.userMetrics = [
      {
        title: 'Total de usuários',
        value: this.totalUsers,
        description: 'Contas cadastradas na plataforma',
        icon: 'fa-solid fa-users',
        tone: 'green',
      },
      {
        title: 'Novos no mês',
        value: this.totalMonthUsers,
        description: 'Usuários cadastrados neste mês',
        icon: 'fa-solid fa-user-plus',
        tone: 'blue',
      },
      {
        title: 'Usuários ativos',
        value: this.totalActiveUsers,
        description: 'Contas aptas para uso',
        icon: 'fa-solid fa-circle-check',
        tone: 'teal',
      },
      {
        title: 'Usuários inativos',
        value: this.totalInactiveUsers,
        description: 'Contas bloqueadas ou inativas',
        icon: 'fa-solid fa-circle-xmark',
        tone: 'red',
      },
    ];
  }

  private withPercent(items: Array<{label: string; value: number}>, total = 0): DistributionItem[] {
    total = total || items.reduce((sum, item) => sum + item.value, 0);

    return items.map((item) => ({
      label: item.label,
      value: item.value,
      percent: total ? (item.value / total) * 100 : 0,
    }));
  }

  private renderUserGrowthChart(): void {
    const chartData = this.countEntriesPerMonth(this.userGraphData, 12);

    this.renderChart('userGrowthChart', this.userGrowthChart, (chart) => this.userGrowthChart = chart, {
      type: 'line',
      data: {
        labels: this.generateMonths(12),
        datasets: [{
          data: chartData,
          fill: true,
          borderColor: '#22944d',
          backgroundColor: 'rgba(34, 148, 77, 0.12)',
          tension: 0.35,
          pointRadius: 3,
        }]
      },
      options: this.baseChartOptions(),
    });
  }

  private renderTenderCharts(): void {
    this.renderBarChart(
      'tendersBySourceChart',
      this.tendersBySourceChart,
      (chart) => this.tendersBySourceChart = chart,
      this.sourceDistribution,
      '#22944d',
    );
    this.renderBarChart(
      'tendersByUfChart',
      this.tendersByUfChart,
      (chart) => this.tendersByUfChart = chart,
      this.ufDistribution,
      '#2563eb',
    );
  }

  private renderBarChart(
    elementId: string,
    currentChart: Chart | undefined,
    assignChart: (chart: Chart) => void,
    items: DistributionItem[],
    color: string,
  ): void {
    this.renderChart(elementId, currentChart, assignChart, {
      type: 'bar',
      data: {
        labels: items.map((item) => item.label),
        datasets: [{
          data: items.map((item) => item.value),
          backgroundColor: color,
          borderRadius: 6,
        }]
      },
      options: this.baseChartOptions(),
    });
  }

  private renderChart(
    elementId: string,
    currentChart: Chart | undefined,
    assignChart: (chart: Chart) => void,
    config: ChartConfiguration,
  ): void {
    currentChart?.destroy();

    const canvas = document.getElementById(elementId) as HTMLCanvasElement | null;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    assignChart(new Chart(context, config));
  }

  private baseChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display: false},
      },
      scales: {
        x: {
          grid: {display: false},
          ticks: {color: '#64748b'},
        },
        y: {
          beginAtZero: true,
          ticks: {precision: 0, color: '#64748b'},
          grid: {color: 'rgba(148, 163, 184, 0.2)'},
        },
      },
    };
  }

  private generateMonths(count: number): string[] {
    const months = [];
    const date = new Date();

    for (let i = 0; i < count; i++) {
      months.unshift(date.toLocaleString('pt-BR', {month: 'short'}));
      date.setMonth(date.getMonth() - 1);
    }

    return months;
  }

  private countEntriesPerMonth(data: any[], months: number): number[] {
    const date = new Date();
    const monthKeys: string[] = [];
    const counts: {[key: string]: number} = {};

    for (let i = 0; i < months; i++) {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthKeys.unshift(key);
      counts[key] = 0;
      date.setMonth(date.getMonth() - 1);
    }

    data.forEach((item) => {
      const createdAt = new Date(item.created_at);
      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;

      if (key in counts) {
        counts[key] += 1;
      }
    });

    return monthKeys.map((key) => counts[key]);
  }

}
