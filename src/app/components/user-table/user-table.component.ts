import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserService } from '../../user/state/user.service';
import { UserQuery } from '../../user/state/user.query';
import { UserStore } from '../../user/state/user.store';
import { User } from '../../user/state/user.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent {
  newUserForm: FormGroup;

  isModalOpen = false;

  private userService = inject(UserService);
  private userQuery = inject(UserQuery);

  private fb = inject(FormBuilder);

  users$ = this.userQuery.allUsers$;

  canAddUser$: Observable<boolean>;
  allUsersActive$ = this.userQuery.allUsersActive$;
  maximumUsersReached$: Observable<boolean>;

  constructor() {
    // Create the form for adding the new users to the table, whith async validator that checks if name exists
    this.newUserForm = this.fb.group({
      name: [
        '',
        [Validators.required],
        [this.uniqueNameValidator()],
        ['change'],
      ],
      active: [false],
    });

    //Observable to show error if max user count is reached
    this.maximumUsersReached$ = this.userQuery.usersCount$.pipe(
      map((userCount) => {
        return userCount >= 5;
      })
    );

    //Observable to check if we can actually add users
    this.canAddUser$ = combineLatest([
      this.allUsersActive$,
      this.userQuery.usersCount$,
    ]).pipe(
      map(([allActive, usersCount]) => {
        return allActive && usersCount < 5;
      })
    );
  }

  //sorting direction and default column for sorting
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string = 'id'; // Default sort by 'id'

  // Toggle active status for a user
  toggleActive(row: User) {
    this.userService.toggleUserActiveStatus(row.id);
  }

  // Sorting method
  sortTable(column: string) {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.users$ = this.users$.pipe(map((users) => this.sortUsers(users)));
  }

  // Sorting logic to sort the users array
  sortUsers(users: User[]) {
    const sortedUsers = [...users];

    sortedUsers.sort((a: any, b: any) => {
      let compare = 0;

      if (a[this.sortColumn] > b[this.sortColumn]) {
        compare = 1;
      } else if (a[this.sortColumn] < b[this.sortColumn]) {
        compare = -1;
      }

      // Reversing the order if descending is selected
      return this.sortDirection === 'asc' ? compare : -compare;
    });

    return sortedUsers;
  }

  //Functions for showing and hiding modal for adding new users to table
  openModal() {
    this.isModalOpen = true;
    this.newUserForm.reset();
  }
  closeModal() {
    this.isModalOpen = false;
  }

  // Async Validator
  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      // If the input is empty, skip the validation.
      if (!control.value) {
        return of(null);
      }

      //use debounce time to send last value when we stop typing
      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap(() => {
          return this.userService
            .checkNameUnique(control.value)
            .pipe(
              map((isUnique) => (isUnique ? null : { nameNotUnique: true }))
            );
        }),
        first()
      );
    };
  }

  addUser(): void {
    const name = this.newUserForm.get('name')?.value;
    const active = this.newUserForm.get('active')?.value;
    if (name) {
      this.userService.addUser(name, active);
      this.newUserForm.reset();
      this.isModalOpen = false;
    }
  }
}
