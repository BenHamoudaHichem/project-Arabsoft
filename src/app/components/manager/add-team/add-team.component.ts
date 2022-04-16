import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Notify, Report } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css'],
})
export class AddTeamComponent implements OnInit {
  teamForm!: FormGroup
  selectedlist: Dbref[] = [];
  users!: IUser[];
  dropdownSettings!: {};
  dropdownSettings2!: {};

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private AuthenticateService:AuthenticateService

  ) {
    this.getAllUsers()
    this.teamForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.pattern('^[a-zA-Z1-9 ]{2,}$')]],
      manager:['',Validators.required],
      membres: ['', Validators.required],
    })

  }

  selectedItems: { item_id: number; item_text: string }[] = [];

  ngOnInit() {
    this.getAllUsers();
    // Setting of dropdown multiselect
    this.dropdownSettings = {
      singleSelection: false,

      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',

      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
    this.dropdownSettings2 = {
      singleSelection: true,
      idField: 'id',
      textField: 'firstName',
      unSelectAllText: 'UnSelect All',

      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
    console.log(this.users)
  }
  getAllUsers() {
    this.userService.allByRole("member").subscribe((users: IUser[]) => {
      this.users = users;
      console.log(this.users);
    }),
      (error: HttpErrorResponse) => {
        if(error.status==401){
          this.AuthenticateService.redirectIfNotAuth()

        }else{
          Report.failure('Erreur', error.message,'OK')

        }      };
  }

  onItemSelect(item: any) {
    this.selectedlist.push(new Dbref(item.id));
    console.log(this.selectedlist);
    return this.selectedlist
  }
  onSelectAll(items: any) {
    items.forEach( (item:any) => {
      this.selectedlist.push(new Dbref(item.id));
    });


  }

  AddTeam() {
    let myManager:Dbref
    myManager=new Dbref(this.manager?.value[0].id)
    console.log("mm : "+this.manager?.value[0].id)
    console.log("dd : "+this.selectedlist)

    let team = new Team( HTMLEscape.escapeMethod(String(this.titre?.value)),new Dbref(this.manager?.value[0].id),
    this.selectedlist);

    this.teamService.create(team).subscribe((data: any) => {
      console.log(data);
      Notify.success('Equipe crée avec succès');
      this.router.navigate(['/dashboard/manager/teamList']);
    }),(
      error:HttpErrorResponse
    )=>{   if(error.status==401){
      this.AuthenticateService.redirectIfNotAuth()

    }else{
      Report.failure('Erreur', error.message,'OK')

    }}
  }
  get titre() {
    return this.teamForm.get('titre');
  }
  get membres() {
    return this.teamForm.get('membres');
  }
  get manager() {
    return this.teamForm.get('manager');
  }
}
