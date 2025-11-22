import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class TaskComponent implements OnInit {
  task = {
    id: 0,
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    timeEstimate: 0,
    link: ''
  };

  // Переменные для валидации
  isTitleValid: boolean = true;
  isLinkValid: boolean = true;
  titleErrorMessage: string = '';
  linkErrorMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const params = this.activatedRoute.snapshot.queryParams;
    
    if (params['id']) {
      this.task.id = parseInt(params['id']);
      this.loadTaskData();
    }
  }

  private loadTaskData() {
    try {
      const savedData = localStorage.getItem('kanbanData');
      
      if (savedData) {
        const columns = JSON.parse(savedData);
        
        // Ищем задачу во всех колонках
        for (const column of columns) {
          const foundTask = column.tasks.find((t: any) => t.id === this.task.id);
          if (foundTask) {
            // Загружаем данные задачи
            this.task.title = foundTask.title || foundTask.text || '';
            this.task.description = foundTask.description || '';
            this.task.priority = foundTask.priority || 'medium';
            this.task.status = foundTask.status || 'todo';
            this.task.timeEstimate = foundTask.timeEstimate || 0;
            this.task.link = foundTask.link || '';
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error loading task data:', error);
    }
  }

  // Валидация названия задачи
  validateTitle() {
    this.isTitleValid = this.task.title.trim().length > 0;
    this.titleErrorMessage = this.isTitleValid ? '' : 'Название не может быть пустым';
  }

  // Валидация ссылки
  validateLink() {
    if (this.task.link.trim() === '') {
      this.isLinkValid = true;
      this.linkErrorMessage = '';
    } else {
      // Проверяем расширение ссылки и протокол
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;
      const extensionPattern = /\.(com|ru|org|net|io|dev|app|html|pdf|doc|xls|txt)$/i;
      
      const hasValidProtocol = this.task.link.startsWith('http://') || this.task.link.startsWith('https://');
      const hasValidExtension = extensionPattern.test(this.task.link);
      const hasValidFormat = urlPattern.test(this.task.link);
      
      this.isLinkValid = hasValidFormat && (hasValidProtocol || hasValidExtension);
      this.linkErrorMessage = this.isLinkValid ? '' : 'Неверный формат ссылки';
    }
  }

  // Проверка возможности сохранения
  canSave(): boolean {
    return this.isTitleValid && this.isLinkValid;
  }

  save() {
    // Проверяем валидацию перед сохранением
    this.validateTitle();
    this.validateLink();

    if (this.canSave()) {
      // Автоматически добавляем https:// если его нет, но есть домен
      if (this.task.link.trim() !== '' && !this.task.link.startsWith('http')) {
        const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
        if (domainPattern.test(this.task.link)) {
          this.task.link = 'https://' + this.task.link;
        }
      }
      
      this.saveToLocalStorage();
      this.router.navigate(['/kanban']);
    }
  }

  private saveToLocalStorage() {
    try {
      const savedData = localStorage.getItem('kanbanData');
      
      if (savedData) {
        const columns = JSON.parse(savedData);
        
        // Ищем задачу во всех колонках
        for (const column of columns) {
          const taskIndex = column.tasks.findIndex((t: any) => t.id === this.task.id);
          if (taskIndex > -1) {
            // Обновляем задачу
            column.tasks[taskIndex] = {
              id: this.task.id,
              text: this.task.title, // Основной текст для канбана
              title: this.task.title,
              description: this.task.description,
              priority: this.task.priority,
              status: this.task.status,
              timeEstimate: this.task.timeEstimate,
              link: this.task.link
            };
            break;
          }
        }
        
        localStorage.setItem('kanbanData', JSON.stringify(columns));
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  close() {
    this.router.navigate(['/kanban']);
  }
}