import { TaskState } from 'src/app/shared/enums/task-state';

export interface Task {
  name: string;
  description: string;
  dateOfCreation: Date;
  dateOfModification: Date;
  state: TaskState;
  id: number;
  assigneeId?: number;
  assigneeName?: string;
}
