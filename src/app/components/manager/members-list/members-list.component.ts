import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Report } from 'notiflix';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  usersList!: IUser[];
  image!: string;

  constructor(
    private UserService: UserService,
    private AuthenticateService: AuthenticateService
  ) {}

  ngOnInit(): void {
    this.image = 'https://wallpaperaccess.com/full/4321838.jpg';

    this.allTManagers();
  }

  agents() {
    this.UserService.agents().subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
  allTManagers() {
    this.image =
      'https://png.pngtree.com/background/20210711/original/pngtree-creative-synthetic-double-exposure-city-business-minimalist-background-picture-image_1115148.jpg';

    this.UserService.allByRole('tm').subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Error getting team manager', error.message, 'OK');
        }
      };
  }
  allMembers() {
    this.image = 'https://wallpaperaccess.com/full/4321838.jpg';

    this.UserService.allByRole('member').subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
    }),
      (error: HttpErrorResponse) => {
        if (error.status == 401) {
          this.AuthenticateService.redirectIfNotAuth();
        } else {
          Report.failure('Error getting members', error.message, 'OK');
        }
      };
  }
  convertRole(roles: any[]): string {
    if (roles[0].name == 'ROLE_TEAMMANAGER') {
      return "Chef d'équipe";
    }

    return 'Employé(e)';
  }
}
