import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class TaskComponent {
  task = {
    id: 0,
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    timeEstimate: 0,
    link: ''
  };

  constructor(private modalController: ModalController) {}

  save() {
    this.modalController.dismiss(this.task, 'save');
  }

  close() {
    this.modalController.dismiss(null, 'cancel');
  }
}