import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { UserAddEditModalComponent } from 'src/app/components/user-add-edit-modal/user-add-edit-modal.component';
import { LocalstorageKeys } from 'src/app/shared/enums/localstorage-keys';
import { TaskState } from 'src/app/shared/enums/task-state';
import { Task } from 'src/app/shared/interfaces/task';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userList: User[];
  private destroy$ = new Subject<void>();
  constructor(private dialog: MatDialog, private appService: AppService) {}

  ngOnInit() {
    this.refreshUsers();
    this.appService.listUpdated.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refreshUsers();
    });
  }

  refreshUsers() {
    this.userList = this.appService.getArrayFromStorage(
      LocalstorageKeys.Users
    ) as User[];
  }

  newUser() {
    const dialogRef = this.dialog.open(UserAddEditModalComponent);
    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) {
        return;
      }
      this.appService.addElementToStorage(LocalstorageKeys.Users, result);
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserAddEditModalComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) {
        return;
      }
      this.changeUserInAssignedTask(result, false);
      this.appService.editElementInStorage(LocalstorageKeys.Users, result);
    });
  }

  deleteUser(user: User) {
    this.changeUserInAssignedTask(user, true);
    this.appService.deleteElementFromStorage(LocalstorageKeys.Users, user);
  }

  changeUserInAssignedTask(user: User, removeFromTask: boolean = false) {
    if (!user.taskId) {
      return;
    }
    const taskList = this.appService.getArrayFromStorage(
      LocalstorageKeys.Tasks
    ) as Task[];
    const assignedTask = taskList.find((task) => task.assigneeId === user.id);
    if (!assignedTask) {
      return;
    }
    assignedTask.assigneeId = removeFromTask ? undefined : user.id;
    assignedTask.assigneeName = removeFromTask ? undefined : user.name;
    assignedTask.state = removeFromTask
      ? TaskState.InQueue
      : assignedTask.state;
    this.appService.editElementInStorage(LocalstorageKeys.Tasks, assignedTask);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
