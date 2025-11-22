import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { KanbanComponent } from './kanban.component';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [KanbanComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TaskComponent
  ],
  exports: [KanbanComponent]
})
export class KanbanModule { }