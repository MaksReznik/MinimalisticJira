import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { TaskAddEditModalComponent } from 'src/app/components/task-add-edit-modal/task-add-edit-modal.component';
import { UserAddEditModalComponent } from 'src/app/components/user-add-edit-modal/user-add-edit-modal.component';
import { LocalstorageKeys } from 'src/app/shared/enums/localstorage-keys';
import { Task } from 'src/app/shared/interfaces/task';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  taskList: Task[];
  private destroy$ = new Subject<void>();
  constructor(private dialog: MatDialog, private appService: AppService) {}

  ngOnInit() {
    this.refreshTasks();
    this.appService.listUpdated.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refreshTasks();
    });
  }

  refreshTasks() {
    this.taskList = this.appService.getArrayFromStorage(
      LocalstorageKeys.Tasks
    ) as Task[];
  }

  newTask() {
    let dialogRef = this.dialog.open(TaskAddEditModalComponent);
    dialogRef.afterClosed().subscribe((result: Task) => {
      if (!result) {
        return;
      }
      this.changeUserAssignedTask(result);
      this.appService.addElementToStorage(LocalstorageKeys.Tasks, result);
    });
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskAddEditModalComponent, {
      data: task,
    });
    dialogRef.afterClosed().subscribe((result: Task) => {
      if (!result) {
        return;
      }
      if (task.assigneeId !== result.assigneeId) {
        this.changeUserAssignedTask(task, true);
      }
      this.changeUserAssignedTask(result);
      this.appService.editElementInStorage(LocalstorageKeys.Tasks, result);
    });
  }

  deleteTask(task: Task) {
    this.changeUserAssignedTask(task, true);
    this.appService.deleteElementFromStorage(LocalstorageKeys.Tasks, task);
  }

  changeUserAssignedTask(task: Task, removeFromUser: boolean = false) {
    if (!task.assigneeId) {
      return;
    }
    const userList = this.appService.getArrayFromStorage(
      LocalstorageKeys.Users
    ) as User[];
    const chosenUser = userList.find((user) => user.id === task.assigneeId);
    if (!chosenUser) {
      return;
    }
    chosenUser.taskId = removeFromUser ? undefined : task.id;
    chosenUser.taskName = removeFromUser ? undefined : task.name;
    this.appService.editElementInStorage(LocalstorageKeys.Users, chosenUser);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
