import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {

  isModalOpen = false;
  newUser = { name: '', active: false };

  rows = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
    { id: 3, name: 'Charlie', active: true }
  ];

  currentSort = {
    column: '',
    direction: '' as 'asc' | 'desc' | ''
  };

  toggleActive(row: any) {
    row.active = !row.active;
  }

  sortTable(column: string) {
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    const directionFactor = this.currentSort.direction === 'asc' ? 1 : -1;

    this.rows.sort((a: any, b: any) => {
      if (a[column] < b[column]) return -1 * directionFactor;
      if (a[column] > b[column]) return 1 * directionFactor;
      return 0;
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.newUser = { name: '', active: false };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addUser() {
    const newId = this.rows.length ? Math.max(...this.rows.map(row => row.id)) + 1 : 1;
    this.rows.push({ id: newId, ...this.newUser });
    this.closeModal();
  }

}
