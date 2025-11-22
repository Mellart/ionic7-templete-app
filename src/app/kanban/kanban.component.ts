import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Task {
  id: number;
  text: string;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  timeEstimate?: number;
  link?: string;
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

  constructor(private router: Router) {
    this.loadData();
    
    // Слушаем события навигации чтобы обновить данные при возврате
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/kanban') {
          console.log('=== DEBUG: Returned to kanban, reloading data ===');
          this.loadData();
        }
      });
  }

  // Открыть страницу редактирования задачи
  openTaskModal(task: Task) {
    this.router.navigate(['/task-edit'], {
      queryParams: {
        id: task.id,
        text: task.text,
        title: task.title || task.text,
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || this.getStatusByColumn(task),
        timeEstimate: task.timeEstimate || 0,
        link: task.link || ''
      }
    });
  }

  // Получить статус по колонке
  private getStatusByColumn(task: Task): string {
    for (const column of this.columns) {
      if (column.tasks.find(t => t.id === task.id)) {
        switch (column.title) {
          case 'To Do': return 'todo';
          case 'In Progress': return 'inprogress';
          case 'Done': return 'done';
          default: return 'todo';
        }
      }
    }
    return 'todo';
  }

  // Добавление задачи
  addTask(column: Column) {
    let maxId = 0;
    this.columns.forEach(col => {
      col.tasks.forEach(task => {
        if (task.id > maxId) {
          maxId = task.id;
        }
      });
    });
    
    const newId = maxId + 1;
    const status = this.getStatusByColumnTitle(column.title);
    const newTask: Task = {
      id: newId,
      text: 'New Task',
      title: 'New Task',
      status: status
    };
    column.tasks.push(newTask);
    this.saveData();
  }

  private getStatusByColumnTitle(columnTitle: string): string {
    switch (columnTitle) {
      case 'To Do': return 'todo';
      case 'In Progress': return 'inprogress';
      case 'Done': return 'done';
      default: return 'todo';
    }
  }

  // Обработка перетаскивания
  onDragStart(event: any, task: Task) {
    event.dataTransfer.setData('text/plain', task.id.toString());
  }

  onDrop(event: any, column: Column) {
    event.preventDefault();
    const taskId = parseInt(event.dataTransfer.getData('text/plain'));
    let task: Task | undefined = undefined;
    let sourceColumn: Column | undefined = undefined;

    for (const col of this.columns) {
      const foundTask = col.tasks.find(t => t.id === taskId);
      if (foundTask) {
        task = foundTask;
        sourceColumn = col;
        break;
      }
    }

    if (task && sourceColumn) {
      const index = sourceColumn.tasks.indexOf(task);
      if (index > -1) {
        sourceColumn.tasks.splice(index, 1);
      }

      // Обновляем статус при перемещении
      task.status = this.getStatusByColumnTitle(column.title);
      column.tasks.push(task);
      this.saveData();
    }
  }

  // Сохранение данных в localStorage
  saveData() {
    try {
      localStorage.setItem('kanbanData', JSON.stringify(this.columns));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Загрузка данных из localStorage
  loadData() {
    try {
      const savedData = localStorage.getItem('kanbanData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData && parsedData.length > 0) {
          this.columns = parsedData;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  ngOnInit() {
    this.loadData();
  }
}