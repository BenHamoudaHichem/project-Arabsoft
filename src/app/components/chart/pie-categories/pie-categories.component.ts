import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { InterventionStatisticService } from 'src/app/services/statistics/intervention/intervention-statistic.service';
import { Associatif } from 'src/app/services/types/associatif';

export type ChartOptions = {
  series: ApexNonAxisChartSeries
  chart: ApexChart
  responsive: ApexResponsive[]
  labels: any
}
@Component({
  selector: 'app-pie-categories',
  templateUrl: './pie-categories.component.html',
  styleUrls: ['./pie-categories.component.css']
})
export class PieCategoriesComponent implements OnInit {


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private interventionStatisticService:InterventionStatisticService) {

    this.interventionStatisticService.getPieCategories.subscribe((res:Associatif[])=>{
      this.chartOptions = {

        series:  res.flatMap(x=>Number([x.value])),
        chart: {
          width: 380,
          type: "pie"
        },
        labels: res.flatMap(x=> [x.key]),
        responsive: [
          {
            breakpoint: 480,
            options: {
          
              chart: {
                
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      }
    })

  }
  ngOnInit(): void {
  }

}
