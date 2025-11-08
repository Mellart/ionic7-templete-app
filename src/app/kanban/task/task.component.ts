import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const taskId = params['id'];
      if (taskId) {
        this.task.id = parseInt(taskId);
      }
    });
  }

  save() {
    this.router.navigate(['/kanban']);
  }

  close() {
    this.router.navigate(['/kanban']);
  }
}