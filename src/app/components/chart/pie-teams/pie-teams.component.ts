import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { TeamStatisticService } from 'src/app/services/statistics/team/team-statistic.service';
import { Associatif } from 'src/app/services/types/associatif';
export type ChartOptions = {
  series: ApexNonAxisChartSeries
  chart: ApexChart
  responsive: ApexResponsive[]
  labels: any
}
@Component({
  selector: 'app-pie-teams',
  templateUrl: './pie-teams.component.html',
  styleUrls: ['./pie-teams.component.css']
})
export class PieTeamsComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
labels:string[]=[]
  constructor(private temStatisticService:TeamStatisticService,private translateServ:TranslateService) {
    this.temStatisticService.getPieTeams.subscribe((res:Associatif[])=>{
    res.flatMap(x=> [String(x.key)]).forEach((element:any)=>
    (this.translateServ.stream(element).subscribe((value)=>{this.labels.push(value);})))
     this.chartOptions = {
        series: res.flatMap(x=> [Number(x.value)]),
        chart: {
          width: 380,
          type:  "pie"
        },
        labels: this.labels,
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
      };
    })

  }
  ngOnInit(): void {
  }

}
