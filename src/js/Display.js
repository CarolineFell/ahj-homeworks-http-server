/* eslint-disable class-methods-use-this */
export default class Display {
  constructor() {
    this.toDoTasks = document.querySelector('#todo .column-tasks');
    this.inProgressTasks = document.querySelector('#in-progress .column-tasks');
    this.doneTasks = document.querySelector('#done .column-tasks');
  }

  addNewTask(parentElement, value) {
    if (value !== '') {
      const newTask = document.createElement('div');
      newTask.className = 'item-task';
      newTask.innerHTML = `
        ${value}
        <div class="delete-task hidden"></div>
      `;
      // <div class="item-task">
      //   ${value}
      //   <div class="delete-task hidden"></div>
      // </div>
      parentElement.appendChild(newTask);
    }
  }

  addTasks(parentElement, array) {
    for (let i = 0; i < array.length; i += 1) {
      this.addNewTask(parentElement, array[i]);
    }
  }

  initTasks(initData) {
    this.addTasks(this.toDoTasks, initData.todo);
    this.addTasks(this.inProgressTasks, initData.inProgress);
    this.addTasks(this.doneTasks, initData.done);
  }
}