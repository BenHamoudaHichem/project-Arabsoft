import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Notify, Report } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Intervention } from 'src/app/models/works/intervention';
import { CategoryService } from 'src/app/services/category/category.service';
import { ICategory } from 'src/app/services/category/icategory';
import { IMaterial } from 'src/app/services/resources/material/imaterial';
import { EquipmentService } from 'src/app/services/resources/material/material.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { DateValidation } from 'src/app/services/validation/DateValidation';
import { IIntervention } from 'src/app/services/works/intervention/iintervention';
import { InterventionService } from 'src/app/services/works/intervention/intervention.service';

@Component({
  selector: 'app-create-intervention',
  templateUrl: './create-intervention.component.html',
  styleUrls: ['./create-intervention.component.css'],
})
export class CreateInterventionComponent implements OnInit {
  createInterventionForm!: FormGroup;
  demandList: any = [];
  categoryList!: ICategory[];
  interventionList!: IIntervention[];
  materialsList!: IMaterial[];
  teamList!: ITeam[];
  idDemand!: string;
  constructor(
    private formBuilder: FormBuilder,
    private interventionService: InterventionService,
    private categoryService: CategoryService,
    private teamService: TeamService,
    private materialService: EquipmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createInterventionForm = this.formBuilder.group(
      {
        title: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')],
        ],
        description: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z ]{10,}$')],
        ],
        category: ['', [Validators.required]],
        date: ['', [Validators.required]],
        team: ['', [Validators.required]],
        intervention: [''],
        Materiel: ['', [Validators.required]],
      },
      {
        validators: DateValidation.DateConfirmation(
          'date',
          new Date('2019-12-07')
        ),
      }
    );
  }

  dropdownSettings!: {};
  ngOnInit() {
    this.idDemand=localStorage.getItem("_id")!
    this.allCategory();
    this.getMaterials();

    this.allTeam()
    this.getInterventions();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(JSON.stringify(items));
  }

  allTeam() {
    this.teamService.all().subscribe((data: ITeam[]) => {
      this.teamList = data;
      console.log(this.teamList);
    }),
      (errors: HttpErrorResponse) => {
        Report.failure('erreur getting Teams', errors.message, 'Ok');
      };
  }
  getMaterials() {
    this.materialService.materialStatusOn().subscribe((data: IMaterial[]) => {
      this.materialsList = data;
      console.log(this.materialsList);
    }),
      (errors: HttpErrorResponse) => {
        Report.failure('erreur getting materials', errors.message, 'Ok');
      };
  }

  allCategory() {
    this.categoryService.all().subscribe((data: ICategory[]) => {
      this.categoryList = data;
      console.log(this.categoryList);
    }),
      (errors: HttpErrorResponse) => {
        Report.failure('erreur getting categories', errors.message, 'Ok');
      };
  }

  Creer() {
    // console.log(this.createInterventionForm.value)

    let intervention = new Intervention(
      this.title?.value,
      this.description?.value,
      this.category?.value,
      this.date?.value,
      '',
      this.demandList.push(new Dbref(this.idDemand)),
      this.team?.value,

      this.date?.value,
      this.Materiel?.value
    );
    console.log(this.demandList);
    //console.log(intervention);
    this.interventionService.create(intervention).subscribe((data: any) => {
      console.log(data);
      if (data.status == true) {
        Report.success('Notification', data.message, 'OK');
        this.router.navigate(['/dashboard/manager/interventionList']);
      } else {
        Report.success('Notification', data.message, 'OK');
      }
    }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'Ok');
      };
  }

  getInterventions() {
    this.interventionService.all().subscribe((res: IIntervention[]) => {
      this.interventionList = res;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('erreur getting interventions', error.message, 'ok');
      };
  }

  get intervention() {
    return this.createInterventionForm.get('intervention');
  }

  get title() {
    return this.createInterventionForm.get('title');
  }
  get description() {
    return this.createInterventionForm.get('description');
  }
  get category() {
    return this.createInterventionForm.get('category');
  }
  get date() {
    return this.createInterventionForm.get('date');
  }
  get team() {
    return this.createInterventionForm.get('team');
  }
  get Materiel() {
    return this.createInterventionForm.get('Materiel');
  }

  getOneInterventions() {
    this.interventionService
      .showIntervention(this.intervention?.value)
      .subscribe((res: IIntervention) => {
        this.title?.setValue(res.title);
        this.description?.setValue(res.description);
        this.date?.setValue(res.startedAt);
        this.category?.setValue(res.category);
        this.Materiel?.setValue(res.materials);
        this.team?.setValue(res.team);
      }),
      (error:HttpErrorResponse)=>
      {Report.failure('Erreur',error.message,'OK')  }
}
}
