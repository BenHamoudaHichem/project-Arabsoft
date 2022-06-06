import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  teamForm!: FormGroup;
  selectedlist: Dbref[] = [];
  users!: IUser[];
  teamDropdownSettings!: {};
  tmDropdownSettings!: {};

  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private userService: UserService,
    private router: Router,
    private AuthenticateService: AuthenticateService
  ) {
    this.allByRole();
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
    this.allByRole();
    // Setting of dropdown multiselect
    this.teamDropdownSettings = {
      singleSelection: false,

      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',

      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
    this.tmDropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'firstName',
      unSelectAllText: 'UnSelect All',

      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
  }
  allByRole() {
    this.userService.agents(undefined).subscribe((users: HttpResponse<IUser[]>) => {
      this.users = users.body!
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };
  }

  onItemSelect(item: any) {
    this.selectedlist.push(new Dbref(item.id));
    return this.selectedlist;
  }
  onSelectAll(items: any) {
    items.forEach((item: any) => {
      this.selectedlist.push(new Dbref(item.id));
    });
  }

  create() {
    let myManager: Dbref;
    myManager = new Dbref(this.manager?.value[0].id);
    console.log('mm : ' + this.manager?.value[0].id);
    console.log('dd : ' + this.selectedlist);
    this.selectedlist;
    let team = new Team(
      HTMLEscape.escapeMethod(String(this.titre?.value)),
      new Dbref(this.manager?.value[0].id),
      plainToClass(Dbref, this.selectedlist)
    );
    console.log(team);
    this.teamService.create(team).subscribe((data: any) => {
      console.log(data);
      Notify.success('Equipe crée avec succès');
      this.router.navigate(['/dashboard/manager/teamList']);
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
  check() {
    Object.keys(this.teamForm.controls).forEach((key) => {
      if (this.teamForm.get(key)!.errors) {
        console.log(this.teamForm.get(key)!.errors);
        if (this.teamForm.get(key)!.errors!.hasOwnProperty('required')) {
          Report.failure(key, 'Champs obligatoire', "D'accord");
        }
        if (this.teamForm.get(key)!.errors!.hasOwnProperty('pattern')) {
          let stringAlpha: string = ' des lettres alphabétiques ';
          let stringdigit: string = ' des chiffres ';
          let stringMin: string = ' au minimum ';
          let stringMax: string = ' au maximum ';
          let stringOperation: string = String(
            this.teamForm.get(key)!.errors!['pattern'].requiredPattern
          );
          console.log(stringOperation);

          let res: string = '';
          if (stringOperation.indexOf('a-z') != -1) {
            res = 'Ce champs doit contenir';
            res = res + stringAlpha;
          }
          if (stringOperation.indexOf('0-9') != -1) {
            if (res.length == 0) {
              res = 'Ce champs doit contenir';
              res = res + stringdigit;
            } else {
              res = res + 'et' + stringdigit;
            }
          }

          if (stringOperation.includes('{')) {
            let min: number = Number(
              stringOperation.substring(
                stringOperation.indexOf('{') + 1,
                stringOperation.indexOf(',')
              )
            );
            res = res.concat('avec un taille de ' + min + stringMin);
            if (
              Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              ) !== 0
            ) {
              let max: number = Number(
                stringOperation.substring(
                  stringOperation.indexOf(',') + 1,
                  stringOperation.indexOf('}')
                )
              );
              res = res.concat('et de ' + max + stringMax);
            }
          }

          Report.failure(key, res, "D'accord");
        }
      }
    });
  }
}
