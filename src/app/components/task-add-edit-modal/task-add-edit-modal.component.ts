import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { LocalstorageKeys } from 'src/app/shared/enums/localstorage-keys';
import { TaskState } from 'src/app/shared/enums/task-state';
import { Task } from 'src/app/shared/interfaces/task';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-task-add-edit-modal',
  templateUrl: './task-add-edit-modal.component.html',
  styleUrls: ['./task-add-edit-modal.component.scss'],
})
export class TaskAddEditModalComponent implements OnInit {
  taskForm: FormGroup;
  taskStates = Object.keys(TaskState).map(
    (key) => TaskState[key as keyof typeof TaskState]
  );
  TaskStateEnum = TaskState;
  userList: User[];

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskAddEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public taskData: Task
  ) {
    this.taskForm = this.fb.group({
      name: [taskData?.name || '', Validators.required],
      description: [taskData?.description || '', Validators.required],
      dateOfCreation: [
        { value: taskData?.dateOfCreation || new Date(), disabled: true },
        Validators.required,
      ],
      dateOfModification: [
        { value: taskData?.dateOfModification || new Date(), disabled: true },
        Validators.required,
      ],
      state: [taskData?.state || TaskState.InQueue, Validators.required],
      id: [
        { value: taskData?.id || new Date().getTime(), disabled: true },
        ,
        Validators.required,
      ],
      assigneeId: [taskData?.assigneeId || null],
      assigneeName: [taskData?.assigneeName || null],
    });
  }

  ngOnInit() {
    this.refreshAvailableUsers();
  }

  refreshAvailableUsers() {
    this.userList = (
      this.appService.getArrayFromStorage(LocalstorageKeys.Users) as User[]
    ).filter((user) => !user.taskId || this.taskData?.assigneeId === user.id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (!this.taskForm.valid) {
      return;
    }
    this.taskForm.controls['dateOfModification'].setValue(new Date());
    const assigneeId = this.taskForm.controls['assigneeId'].value;
    if (assigneeId) {
      this.taskForm.controls['assigneeName'].setValue(
        this.userList.find((user) => user.id === assigneeId)?.name
      );
    }
    this.dialogRef.close(this.taskForm.getRawValue());
  }
}
