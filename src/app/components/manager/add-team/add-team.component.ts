import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Notify, Report } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Team } from 'src/app/models/resources/team';
import { User } from 'src/app/models/user';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

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
    private router: Router
  ) {
    this.getAllUsers()
    this.teamForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
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
        Report.failure('Error getting members', error.message, 'OK');
      };
  }

  onItemSelect(item: any) {
    this.selectedlist.push(new Dbref(item.id));
    console.log(this.selectedlist);
  }
  onSelectAll(items: any) {
    items.forEach( (item:any) => {
      this.selectedlist.push(new Dbref(item.id));
    });


  } /*
  onRemove(item:any)
  {
  this.new=  this.selectedlist.filter( i => i.id == item.id)
    this.teams=this.new
    console.log("Remove___________")
    console.log(this.teams)
  }

*/

  AddTeam() {
    let myManager:Dbref
    myManager=new Dbref(this.manager?.value[0].id)
    console.log("mm : "+this.manager?.value[0].id)
    console.log("dd : "+this.selectedlist)

    let team = new Team(String(this.titre?.value),new Dbref(this.manager?.value[0].id),
    this.selectedlist);
    console.log(team);
  /*  this.teamService.create(team).subscribe((data: any) => {
      console.log(data);
      Notify.success('Equipe crée avec succès');
      this.router.navigate(['/manager/teamList']);
    });*/
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
