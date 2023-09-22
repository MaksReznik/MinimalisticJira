import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-user-add-edit-modal',
  templateUrl: './user-add-edit-modal.component.html',
  styleUrls: ['./user-add-edit-modal.component.scss'],
})
export class UserAddEditModalComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserAddEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User
  ) {
    this.userForm = this.fb.group({
      name: [userData?.name || '', Validators.required],
      id: [
        { value: userData?.id || new Date().getTime(), disabled: true },
        Validators.required,
      ],
      taskId: [{ value: userData?.taskId || null, disabled: true }],
      taskName: [{ value: userData?.taskName || null, disabled: true }],
    });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      return;
    }
    this.dialogRef.close(this.userForm.getRawValue());
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
