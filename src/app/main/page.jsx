"use client";
import React, { useState, useEffect, useContext } from "react";
import CategoryList from "../../components/CategoryList";
import TaskList from "../../components/TaskList";
import { ctx } from "../../stores/Context";
import { Button } from "@mui/material";

export default function AppPage() {
 const { task } = useContext(ctx);
 const [selectedCategoryId, setSelectedCategoryId] = useState(null);
 const [showAllTasks, setShowAllTasks] = useState(false);

 useEffect(() => {
  if (showAllTasks) {
   task.fetchTasks();
  } else if (selectedCategoryId !== null && selectedCategoryId !== undefined) {
   task.fetchTasks(selectedCategoryId);
  }
 }, [selectedCategoryId, showAllTasks, task]);

 return (
  <>

   <h1 className="w-full text-2xl font-bold mb-8 text-center">
    Welcome to the todo app!
   </h1>


   <main className="max-w-4xl mx-auto flex gap-8 items-start">
    <div className="w-1/3 flex flex-col items-center">
     <CategoryList
      onSelect={id => {
       setSelectedCategoryId(id);
       setShowAllTasks(false);
      }}
      selectedId={selectedCategoryId}
     />
     <Button
      variant="contained"
      color="primary"
      className="mt-12 w-4/5"
      onClick={() => setShowAllTasks(true)}
     >
      Show all tasks
     </Button>
    </div>
    <div className="w-2/3 flex flex-col items-center ml-0">
     <TaskList categoryId={showAllTasks ? null : selectedCategoryId} />
    </div>
   </main>
  </>
 );
}