import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserState, UserStore } from './user.store';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserQuery extends QueryEntity<UserState> {
  
  constructor(store: UserStore) {
    super(store);
  }

  //select all users for the table view
  allUsers$ = this.selectAll();

  //Check if all users are active
  allUsersActive$ = this.selectAll().pipe(
    map(users => users.every(user => user.active))
  );

  //Select user count
  usersCount$ = this.selectCount();


  //Get observable that checks if name exists in store
  public uniqeNameObeservable(name: string): Observable<boolean>{
    return this.selectAll().pipe(
      map(users => !users.some(user => user.name === name))
    );
  }

}
