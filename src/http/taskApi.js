import { $authhost } from "./index";

// Отримати всі таски для категорії
export const getTasks = (categoryId) => {
  if (categoryId !== null && categoryId !== undefined) {
    return $authhost.get(`api/tasks?categoryId=${categoryId}`);
  }
  return $authhost.get("api/tasks");
};

// Створити таск
export const createTask = (data) => {
 return $authhost.post("api/tasks", data);
};

// Оновити таск
export const updateTask = (id, data) => {
 return $authhost.put(`api/tasks/${id}`, data);
};

// Видалити таск
export const deleteTask = (id) => {
 return $authhost.delete(`api/tasks/${id}`);
};