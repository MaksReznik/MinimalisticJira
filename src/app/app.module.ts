import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListComponent } from './components/task-list/task-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { TaskAddEditModalComponent } from './components/task-add-edit-modal/task-add-edit-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAddEditModalComponent } from './components/user-add-edit-modal/user-add-edit-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

const angularMaterialModules = [
  MatExpansionModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
];
@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskAddEditModalComponent,
    UserListComponent,
    UserAddEditModalComponent,
  ],
  imports: [
    ...angularMaterialModules,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
