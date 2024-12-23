import {Component, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {DashboardService} from "@services/Dashboard/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalMonthUsers: number = 0;
  totalActiveUsers: number = 0;
  totalInactiveUsers: number = 0;
  totalTenders: number = 0;
  totalMonthTenders: number = 0;
  userGraphData: any;
  data: number[] = [];

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadUserGraphData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe(response => {
      if (response.status) {
        this.totalUsers = response.data.totalUsers;
        this.totalMonthUsers = response.data.totalMonthUsers;
        this.totalActiveUsers = response.data.totalActiveUsers;
        this.totalInactiveUsers = response.data.totalInactiveUsers;
        this.totalTenders = response.data.totalTenders;
        this.totalMonthTenders = response.data.totalMonthTenders;
      } else {
        console.error('Error fetching dashboard data:', response.error);
      }
    });
  }

  generateMonths(count: number): string[] {
    const months = [];
    const date = new Date();
    for (let i = 0; i < count; i++) {
      months.unshift(date.toLocaleString('default', { month: 'short' }));
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  }

  countEntriesPerMonth(data: any[], months: number) {
    const counts: { [key: string]: number } = {};

    const dataArray: number[] = [];

    for (let i = 0; i < months; i++) {
      dataArray.push(0);
    }

    data.forEach(item => {
      const date = new Date(item.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      counts[key] = (counts[key] || 0) + 1;
    });

    for (const key in counts) {
      dataArray[Number(key.split('-')[1]) - 1] = counts[key];
    }

    return dataArray;
  }


  loadUserGraphData(): void {
    this.dashboardService.getUserGraph({period: 'annual'}).subscribe(response => {
      if (response.status) {
        this.userGraphData = response.data;
        this.renderChart();
      } else {
        console.error('Error fetching user graph data:', response.error);
      }
    });
  }

  renderChart(): void {
    Chart.register(...registerables);

    const ctx = document.getElementById('userGrowthChart') as HTMLCanvasElement;
    new Chart(ctx.getContext('2d')!, {
      type: 'line',
      data: {
        labels: this.generateMonths(12),
        datasets: [{
          data: this.countEntriesPerMonth(this.userGraphData, 12),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}
