
import { $authhost } from "./index";

// Отримати всі категорії
export const getCategories = () => {
 return $authhost.get("api/categories");
};

// Створити категорію
export const createCategory = (data) => {
 return $authhost.post("api/categories", data);
};

// Оновити категорію
export const updateCategory = (id, data) => {
 return $authhost.put(`api/categories/${id}`, data);
};

// Видалити категорію
export const deleteCategory = (id) => {
 return $authhost.delete(`api/categories/${id}`);
};