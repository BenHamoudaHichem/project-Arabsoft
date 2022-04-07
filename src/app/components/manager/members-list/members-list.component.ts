import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Report } from 'notiflix';
import { IUser } from 'src/app/services/user/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css'],
})
export class MembersListComponent implements OnInit {
  usersList!: IUser[];
  constructor(private UserService: UserService) {}

  ngOnInit(): void {
    this.showAll();
  }

  showAll() {
    this.UserService.all().subscribe((res: IUser[]) => {
      console.log(res);
      this.usersList = res;
    }),
      (error: HttpErrorResponse) => {
        Report.failure('Erreur', error.message, 'OK');
      };
  }
}
