import { makeAutoObservable } from "mobx";
import { getTasks, createTask, updateTask, deleteTask } from "../http/taskApi";

class TaskStore {
 tasks = [];
 isLoading = false;
 error = null;

 constructor() {
  makeAutoObservable(this);
 }

 setTasks(tasks) {
  this.tasks = tasks;
 }

 setLoading(bool) {
  this.isLoading = bool;
 }

 setError(error) {
  this.error = error;
 }

 async fetchTasks(categoryId) {
  if (categoryId !== null && categoryId !== undefined) {
   const res = await getTasks(categoryId); // запит з параметром
   this.setTasks(res.data);
  } else {
   const res = await getTasks(); // запит без параметра
   this.setTasks(res.data);
  }
 }

 async addTask(data) {
  this.setLoading(true);
  try {
   const res = await createTask(data);
   this.tasks.push(res.data);
   this.setError(null);
  } catch (e) {
   this.setError(e.response?.data?.message || e.message || "Failed to add task");
  } finally {
   this.setLoading(false);
  }
 }

 async updateTask(id, data) {
  this.setLoading(true);
  try {
   const res = await updateTask(id, data);
   this.tasks = this.tasks.map(task =>
    task.id === id ? res.data : task
   );
   this.setError(null);
  } catch (e) {
   this.setError(e.response?.data?.message || e.message || "Failed to update task");
  } finally {
   this.setLoading(false);
  }
 }

 async removeTask(id) {
  this.setLoading(true);
  try {
   await deleteTask(id);
   this.tasks = this.tasks.filter(task => task.id !== id);
   this.setError(null);
  } catch (e) {
   this.setError(e.response?.data?.message || e.message || "Failed to delete task");
  } finally {
   this.setLoading(false);
  }
 }
}

export default TaskStore;