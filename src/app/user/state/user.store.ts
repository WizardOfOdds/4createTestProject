import { EntityState, EntityStore, Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { User } from './user.model';

//sets the User for Entity, and number for IDType
//cause the Entity state has hte signature EntityState<Entity = any, IDType = any>
export interface UserState extends EntityState<User, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserStore extends EntityStore<UserState> {
  constructor() {
    super();
    this.set([
      { id: 1, name: 'Bob', active: true },
      { id: 2, name: 'Alice', active: false },
      { id: 3, name: 'Mortimer', active: true },
    ]);
  }
}
