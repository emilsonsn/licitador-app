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

  loadUserGraphData(): void {
    this.dashboardService.getUserGraph({period: 'monthly'}).subscribe(response => {
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
        labels: this.userGraphData.map((entry: any) => new Date(entry.created_at).toLocaleDateString()),
        datasets: [{
          label: 'User Growth',
          data: this.userGraphData.map((entry: any) => entry.count),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
