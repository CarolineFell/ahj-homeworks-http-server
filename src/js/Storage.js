/* eslint-disable class-methods-use-this */
export default class Storage {
  save(data) {
    localStorage.setItem('tasks', JSON.stringify(data));
  }

  load() {
    return localStorage.getItem('tasks');
  }
}