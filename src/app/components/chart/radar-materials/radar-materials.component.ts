import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { MaterialStatisticService } from 'src/app/services/statistics/material/material-statistic.service';
import { Associatif } from 'src/app/services/types/associatif';
export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  title: ApexTitleSubtitle
  xaxis: ApexXAxis
};
@Component({
  selector: 'app-radar-materials',
  templateUrl: './radar-materials.component.html',
  styleUrls: ['./radar-materials.component.css']
})
export class RadarMaterialsComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;


  constructor(private materialStatisticService:MaterialStatisticService) {
    this.materialStatisticService.getPieStatus.subscribe((res:Associatif[])=>{
      this.chartOptions = {
        series: [
          {
            name: "Series 1",
            data: res.flatMap(x=> [Number(x.value)])
          }
        ],
        chart: {
          height: 350,
          type: "radar"
        },
        title: {
          text: "Basic Radar Chart"
        },
        xaxis: {
          categories: res.flatMap(x=> [x.key])
        }
      };
    })

  }
  ngOnInit(): void {
  }

}
