import { Injectable, inject } from '@angular/core';
import { UserStore } from './user.store';
import { UserQuery } from './user.query';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userQuery = inject(UserQuery);
  private userStore = inject(UserStore); 
  constructor() {}

  toggleUserActiveStatus(userId: number):void {
    this.userStore.update(userId, (user: User) => ({
      ...user,
      active: !user.active
    }));
  }

  checkNameUnique(name: string): Observable<boolean> {
    return timer(1000).pipe(
      switchMap(() =>
        this.userQuery.uniqeNameObeservable(name)
      )
    );
  }

  addUser(name: string, active: boolean): void {
    this.userStore.add({
      //Get Count returns a number of users, and we just increment it to add id
      id: this.userQuery.getCount() + 1, 
      name,
      active
    });
  }
}
