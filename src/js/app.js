import Dislay from './Display';
import defaultTasks from './defaultTasks';
import Storage from './Storage';

const storage = new Storage();
const display = new Dislay();
const tasks = document.querySelector('#tasks');

let dragged = null;
let vanished = null;
let elementWidth;
let elementHeight;
let elementTop;
let elementLeft;

function dragAndDrop(event, element) {
  const closest = document.elementFromPoint(event.clientX, event.clientY);
  const { top } = closest.getBoundingClientRect();

  if (closest.classList.contains('item-task')) {
    if (event.pageY > window.scrollY + top + closest.offsetHeight / 2) {
      closest
        .closest('.column-tasks')
        .insertBefore(element, closest.nextElementSibling);
    } else {
      closest.closest('.column-tasks').insertBefore(element, closest);
    }
  } else if (closest.classList.contains('column-tasks') && !closest.querySelector('.item-task')) {
    closest.append(element);
  }
}

function saveTasks() {
  const toDoTasks = document.querySelectorAll('#todo .column-tasks .item-task');
  const inProgressTasks = document.querySelectorAll('#in-progress .column-tasks .item-task');
  const doneTasks = document.querySelectorAll('#done .column-tasks .item-task');

  const savedTasks = {
    todo: [],
    inProgress: [],
    done: [],
  };

  for (const item of toDoTasks) {
    savedTasks.todo.push(item.textContent);
  }

  for (const item of inProgressTasks) {
    savedTasks.inProgress.push(item.textContent);
  }

  for (const item of doneTasks) {
    savedTasks.done.push(item.textContent);
  }
  storage.save(savedTasks);
}

document.addEventListener('DOMContentLoaded', () => {
  const storageData = JSON.parse(storage.load());
  if (storageData !== null) {
    display.initTasks(storageData);
  } else {
    display.initTasks(defaultTasks());
  }
});

tasks.addEventListener('mousedown', (event) => {
  // add new card
  if (event.target.classList.contains('add-task')) {
    event.target.parentNode.querySelector('.input-task').classList.remove('hidden');
    event.target.classList.add('hidden'); // hide the add-task button

    // cancel adding the card
  } else if (event.target.classList.contains('cancel-task-hidden')) {
    event.target
      .closest('.column')
      .querySelector('.add-task')
      .classList.remove('hidden');
    event.target.parentNode.classList.add('hidden');

    // add card
  } else if (event.target.classList.contains('add-task-hidden')) {
    const columnTasks = event.target
      .closest('.column')
      .querySelector('.column-tasks');
    const input = event.target.closest('.input-task').querySelector('#text-task');
    display.addNewTask(columnTasks, input.value);
    input.value = '';
    event.target
      .closest('.column')
      .querySelector('.add-task')
      .classList.remove('hidden');
    event.target.parentNode.classList.add('hidden');
    saveTasks();

    // delete card
  } else if (event.target.classList.contains('delete-task')) {
    const taskToDelete = event.target.parentNode;
    taskToDelete.parentNode.removeChild(taskToDelete);
    saveTasks();

    // drag task
  } else if (event.target.classList.contains('item-task')) {
    event.preventDefault();
    event.target.querySelector('.delete-task').classList.add('hidden');
    const { top, left } = event.target.getBoundingClientRect();
    dragged = event.target;
    elementWidth = dragged.offsetWidth;
    elementHeight = dragged.offsetHeight;
    elementLeft = event.pageX - left;
    elementTop = event.pageY - top;

    vanished = event.target.cloneNode(true);
    vanished.innerHTML = '';
    vanished.style.backgroundColor = 'darkgray';
    vanished.style.width = `${elementWidth}px`;
    vanished.style.height = `${elementHeight}px`;

    dragged.classList.add('dragged');
    event.target.parentNode.insertBefore(vanished, event.target.nextElementSibling);

    dragged.style.left = `${event.pageX - elementLeft}px`;
    dragged.style.top = `${event.pageY - elementTop}px`;
    dragged.style.width = `${elementWidth}px`;
    dragged.style.height = `${elementHeight}px`;
  }
});

tasks.addEventListener('mouseleave', (event) => {
  if (dragged) {
    event.preventDefault();
    vanished.parentNode.removeChild(vanished);
    dragged.classList.remove('dragged');
    dragged.style = '';
    vanished = null;
    dragged = null;
  }
});

tasks.addEventListener('mousemove', (event) => {
  if (dragged) {
    event.preventDefault();
    dragAndDrop(event, vanished);
    dragged.style.left = `${event.pageX - elementLeft}px`;
    dragged.style.top = `${event.pageY - elementTop}px`;
  }
});

tasks.addEventListener('mouseup', (event) => {
  if (dragged) {
    dragAndDrop(event, dragged);

    vanished.parentNode.removeChild(vanished);
    dragged.classList.remove('dragged');
    dragged.style = '';
    vanished = null;
    dragged = null;

    saveTasks();
  }
});