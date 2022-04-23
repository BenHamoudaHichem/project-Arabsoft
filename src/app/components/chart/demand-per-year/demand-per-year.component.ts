import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { DemandStatisticService } from 'src/app/services/statistics/demand/demand-statistic.service';
import { IDemandPerYear } from 'src/app/services/statistics/demand/idemand-per-year';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-demand-per-year',
  templateUrl: './demand-per-year.component.html',
  styleUrls: ['./demand-per-year.component.css']
})
export class DemandPerYearComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>|any;

  public stat!:IDemandPerYear[]
  axeX:number[]=[]
  axeY:number[]=[]

  constructor(private demandStats:DemandStatisticService) {

    this.demandStats.getDemandsPerYear.subscribe((res:IDemandPerYear[])=>{
      this.stat= res
      this.stat.forEach((element:IDemandPerYear)=>{

        this.axeX.push(element.month)
        this.axeY.push(element.sum)
      })
      this.chartOptions = {
        series: [
          {
            name: "Demands",
            data: this.axeY
          }
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Les demandes récu dans cette année",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ]
        }
      };
    })

  }

  ngOnInit(): void {
  }

}
