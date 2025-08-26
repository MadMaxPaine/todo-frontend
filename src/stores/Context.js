"use client"
import React, { useMemo } from "react";
import UserStore from "./UserStore";
import CategoryStore from "./CategoryStore";
import TaskStore from "./TaskStore";
export const ctx = React.createContext(null);

export const StoreProvider = ({ children }) => {
 const userStore = useMemo(() => new UserStore(), []);
 const categoryStore = useMemo(() => new CategoryStore(), []);
 const taskStore = useMemo(() => new TaskStore(), []);
 return (
  <ctx.Provider value={{ user: userStore, category: categoryStore, task: taskStore }}>
   {children}
  </ctx.Provider>
 );
};
