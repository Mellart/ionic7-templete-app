import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from './kanban.component';
import { TaskComponent } from './task/task.component';



@NgModule({
  declarations: [KanbanComponent, TaskComponent],
  imports: [
    CommonModule
  ]
})
export class KanbanModule { }
