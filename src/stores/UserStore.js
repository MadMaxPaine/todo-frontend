import { makeAutoObservable } from "mobx";
import { login, registration, logout } from "../http/userApi";
import { REACT_APP_API_URL } from "../utils/consts";
import axios from "axios";

class UserStore {
  _isAuth = false;
  _user = {};
  _isLoading = false;
  _error = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  setUser(objUser) {
    this._user = objUser;
  }

  setLoading(bool) {
    this._isLoading = bool;
  }

  setError(error) {
    this._error = error;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async login(username, password) {
    try {
      const res = await login(username, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.accessToken);
      }
      this.setIsAuth(true);
      this.setUser(res.data.userDto);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Login failed");
      console.error("Login failed:", e.response?.data?.message || e.message);
    }
  }

  async registration(regData) {
    try {
      const res = await registration(regData);
      if (res?.accessToken && res?.userDto) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", res.accessToken);
        }
        this.setIsAuth(true);
        this.setUser(res.userDto);
        this.setError(null);
      } else {
        this.setError("Некоректна відповідь від сервера");
      }
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Registration failed");
      console.error("Registration failed:", e.response?.data?.message || e.message);
    }
  }

  async logout() {
    try {
      await logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      this.setUser({});
      this.setIsAuth(false);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Logout failed");
      console.error("Logout failed:", e.response?.data?.message || e.message);
    }
  }

  async checkAuth() {
    if (this._isLoading) return;
    this.setLoading(true);
    try {
      const res = await axios.get(`${REACT_APP_API_URL}api/user/refresh`, {
        withCredentials: true,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      this.setIsAuth(true);
      this.setUser(res.data.userDto);
      this.setError(null);
    } catch (e) {
      this.setError(e.response?.data?.message || e.message || "Authentication check failed");
      console.error("Authentication check failed:", e.response?.data?.message || e.message);
    } finally {
      this.setLoading(false);
    }
  }
}

export default UserStore;