import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container-intervention',
  templateUrl: './container-intervention.component.html',
  styleUrls: ['./container-intervention.component.css']
})
export class ContainerInterventionComponent implements OnInit {

  step:number=0
  constructor() { }

  ngOnInit(): void {
  }

  changeStep(i:number)
  {
    this.step = i
  }

}
