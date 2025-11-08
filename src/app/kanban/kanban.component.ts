import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Task {
  id: number;
  text: string;
  isEditing?: boolean;
}

interface Column {
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent {
  pageTitle: string = "Kanban"
  columns: Column[] = [
    {
      title: 'To Do',
      tasks: [
        { id: 1, text: 'First Task' },
        { id: 2, text: 'Second Task' }
      ],
    },
    {
      title: 'In Progress',
      tasks: [
        { id: 3, text: 'Work on Kanban' }
      ],
    },
    {
      title: 'Done',
      tasks: [
        { id: 4, text: 'Complete the project' }
      ],
    },
  ];

  constructor(private router: Router) {}

  // Открыть страницу редактирования задачи
  openTaskModal(task: Task) {
    this.router.navigate(['/task-edit'], { queryParams: { id: task.id } });
  }

  // Начать редактирование задачи
  editTask(task: Task) {
    this.stopEditing();
    task.isEditing = true;
  }

  // Остановить редактирование задачи
  stopEditing(task?: Task) {
    if (task) {
      task.isEditing = false;
    } else {
      this.columns.forEach((column) =>
        column.tasks.forEach((task) => (task.isEditing = false))
      );
    }
  }

  // Добавление задачи
  addTask(column: Column) {
    const newId = Math.max(0, ...this.columns.flatMap(col => col.tasks.map(t => t.id))) + 1;
    column.tasks.push({ id: newId, text: 'New Task' });
  }

  // Обработка перетаскивания
  onDragStart(event: any, task: Task) {
    event.dataTransfer.setData('text', task.text);
  }

  onDrop(event: any, column: Column) {
    const taskText = event.dataTransfer.getData('text');
    let task: Task | undefined = undefined;

    this.columns.forEach((col) => {
      col.tasks.forEach((t) => {
        if (t.text === taskText) {
          task = t;
        }
      });
    });

    if (task) {
      this.columns.forEach((col) => {
        const index = col.tasks.indexOf(task!);
        if (index > -1) {
          col.tasks.splice(index, 1);
        }
      });

      column.tasks.push(task);
    }
  }
}