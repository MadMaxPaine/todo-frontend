import { makeAutoObservable } from "mobx";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../http/categoryApi";

class CategoryStore {
  categories = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCategories(categories) {
    this.categories = categories;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setError(error) {
    this.error = error;
  }

  async fetchCategories() {
    this.setLoading(true);
    try {
      const res = await getCategories();
      this.setCategories(res.data);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Failed to fetch categories");
    } finally {
      this.setLoading(false);
    }
  }

  async addCategory(name) {
    this.setLoading(true);
    try {
      const res = await createCategory({ name });
      this.categories.push(res.data);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Failed to add category");
    } finally {
      this.setLoading(false);
    }
  }

  async updateCategory(id, name) {
    this.setLoading(true);
    try {
      const res = await updateCategory(id, { name });
      this.categories = this.categories.map(cat =>
        cat.id === id ? res.data : cat
      );
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Failed to update category");
    } finally {
      this.setLoading(false);
    }
  }

  async removeCategory(id) {
    this.setLoading(true);
    try {
      await deleteCategory(id);
      this.categories = this.categories.filter(cat => cat.id !== id);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Failed to delete category");
    } finally {
      this.setLoading(false);
    }
  }
}

export default  CategoryStore;