import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Report, Notify } from 'notiflix';
import { Dbref } from 'src/app/models/dbref';
import { Team } from 'src/app/models/resources/team';
import { TeamService } from 'src/app/services/resources/team/team.service';
import { ITeam } from 'src/app/services/resources/team/iteam';
import { IUser } from 'src/app/services/user/iuser';

import { UserService } from 'src/app/services/user/user.service';
import { HTMLEscape } from 'src/app/services/validation/HTMLEscapeChars';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { plainToClass } from 'class-transformer';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-update-team',
  templateUrl: './update-team.component.html',
  styleUrls: ['./update-team.component.css'],
})
export class UpdateTeamComponent implements OnInit {
  teamForm!: FormGroup;
  selectedlist: Dbref[] = [];
  users!: IUser[];
  dropdownSettings!: {};
  dropdownSettings2!: {};

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private rout: ActivatedRoute,
    private AuthenticateService: AuthenticateService
  ) {
    this.teamForm = this.formBuilder.group({
      titre: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z1-9 ]{2,}$')],
      ],
      manager: ['', Validators.required],
      membres: ['', Validators.required],
    });
  }

  selectedItems: { item_id: number; item_text: string }[] = [];

  ngOnInit() {
    this.getAllUsers();
    this.getTeam();
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
  }

  onItemSelect(item: any) {
    this.selectedlist.push(new Dbref(item.id));
    console.log(this.selectedlist);
    return this.selectedlist;
  }
  onSelectAll(items: any) {
    items.forEach((item: any) => {
      this.selectedlist.push(new Dbref(item.id));
    });
  }

  getTeam() {
    this.teamService
      .getTeam(String(this.rout.snapshot.paramMap.get('id')))
      .subscribe((res: ITeam) => {
        this.titre?.setValue(res.name);
        this.manager?.setValue(res.manager);
        this.membres?.setValue(res.members);
        //      this.membres?.setValue(Array.from(res.members,x=> plainToClass(User,x)))
      }),
      (errors: HttpErrorResponse) => {
        Report.failure('Erreur', errors.message, 'OK');
      };
  }

  UpdateTeam() {
    let myManager: Dbref;
    myManager = new Dbref(this.manager?.value[0].id);
    console.log('mm : ' + this.manager?.value[0].id);
    console.log('dd : ' + this.selectedlist);

    let team = new Team(
      HTMLEscape.escapeMethod(String(this.titre?.value)),
      new Dbref(this.manager?.value[0].id),
      this.selectedlist
    );

    this.teamService
      .update(String(this.rout.snapshot.paramMap.get('id')), team)
      .subscribe((data: any) => {
        console.log(data);
        Notify.success('Equipe modifier avec succès');
        this.router.navigate([
          '/dashboard/manager/detailTeam',
          String(this.rout.snapshot.paramMap.get('id')),
        ]);
      }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }
  getAllUsers() {
    this.userService.allByRole('member').subscribe((users: IUser[]) => {
      this.users = users;
      console.log(this.users);
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
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
