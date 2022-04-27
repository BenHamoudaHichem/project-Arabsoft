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
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{2,}$')],
      ],
      manager: ['', Validators.required],
      membres: ['', Validators.required],
    });
    this.getTeam();

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
        this.manager?.setValue([res.manager,]);
        this.membres?.setValue(Array.from(res.members,x=> plainToClass(User,x)))

        this.membres?.setValue(res.members);
        console.log(res);

      }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Erreur', error.message, 'OK');
        }
      };

  }

  UpdateTeam() {
    let myManager: Dbref;
    myManager = new Dbref(this.manager?.value[0].id);
    console.log('mm : ' + this.manager?.value[0].id);
    console.log('dd : ' + Array.from(this.membres!.value,(x:any)=> new Dbref(x.id)));

    let team = new Team(
      HTMLEscape.escapeMethod(String(this.titre?.value)),
      new Dbref(this.manager?.value[0].id),
      Array.from(this.membres!.value,(x:any)=> new Dbref(x.id))
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
  check()
{
 Object.keys(this.teamForm.controls).forEach(key => {
   if (this.teamForm.get(key)!.errors) {
   console.log(this.teamForm.get(key)!.errors)
    if(this.teamForm.get(key)!.errors!.hasOwnProperty('required'))
    {
      Report.failure(key,"Champs obligatoire","D'accord")
    }
    if(this.teamForm.get(key)!.errors!.hasOwnProperty('pattern'))
    {
      let stringAlpha:string=" des lettres alphabétiques "
      let stringdigit:string=" des chiffres "
      let stringMin:string=" au minimum "
      let stringMax:string=" au maximum "
      let stringOperation:string=String(this.teamForm.get(key)!.errors!["pattern"].requiredPattern)
      console.log(stringOperation);

      let res:string=""
      if(stringOperation.indexOf("a-z")!=-1)
      {
        res="Ce champs doit contenir"
        res=res+stringAlpha
      }
      if(stringOperation.indexOf("0-9")!=-1){
        if(res.length==0){res="Ce champs doit contenir"
      res=res+ stringdigit}else{

        res=res+"et"+stringdigit
      }
    }

      if (stringOperation.includes("{")) {
        let min:number=Number(stringOperation.substring(
          stringOperation.indexOf("{")+1,
          stringOperation.indexOf(",")
        ))
        res=res.concat("avec un taille de "+min+stringMin)
        if ((Number(stringOperation.substring(stringOperation.indexOf(",")+1,stringOperation.indexOf("}")))!==0)) {
          let max:number=Number(stringOperation.substring(
            stringOperation.indexOf(",")+1,
            stringOperation.indexOf("}")
          ))
          res=res.concat("et de "+max+stringMax)
        }
      }

      Report.failure(key,res,"D'accord")
    }

   }
})
}
}
