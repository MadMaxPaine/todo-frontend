"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ctx } from "../stores/Context";
import {
 Button, Box, Stack, Typography, Checkbox, Chip, IconButton, TextField
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTaskModal from "./AddTaskModal";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const TaskList = observer(({ categoryId }) => {
 const { task, category } = React.useContext(ctx);
 const [modalOpen, setModalOpen] = useState(false);
 const [editTask, setEditTask] = useState(null);
 const [search, setSearch] = useState("");
 const [sortAsc, setSortAsc] = useState(false);
 const [statusFilter, setStatusFilter] = useState("all");

 useEffect(() => {
  if (categoryId !== null && categoryId !== undefined) {
   task.fetchTasks(categoryId);
  } else {
   task.fetchTasks();
  }
 }, [categoryId, task]);

 const getDefaultCategoryId = () => {
  const basic = category.categories?.find(cat => cat.name === "Basic");
  return basic ? basic.id : null;
 };

 const handleAdd = () => {
  setEditTask(null);
  setModalOpen(true);
 };

 const handleEdit = (t) => {
  setEditTask(t);
  setModalOpen(true);
 };

 const handleDelete = async (id) => {
  await task.removeTask(id);
 };

 const handleToggle = async (t) => {
  await task.updateTask(t.id, { ...t, status: t.status === "done" ? "undone" : "done" });
 };

 const filteredTasks = (task.tasks ?? [])
  .filter(t => categoryId ? t.categoryId === categoryId : true)
  .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  .filter(t => {
   if (statusFilter === "all") return true;
   return t.status === statusFilter;
  })
  .sort((a, b) => sortAsc ? a.priority - b.priority : b.priority - a.priority);

 if (task.isLoading) return <Typography>Loading tasks...</Typography>;
 if (task.error) return <Typography color="error">{task.error}</Typography>;

 return (
  <Box className="mt-8 w-full">
   <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-4">
    <Typography variant="h5" className="font-bold">Tasks</Typography>
    <Stack direction="row" spacing={2}>
     <Button variant="contained" onClick={handleAdd}>Add Task</Button>
     <Button
      variant="outlined"
      color="primary"
      startIcon={sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      onClick={() => setSortAsc(!sortAsc)}
     >
      {sortAsc ? "Priority " : "Priority "}
     </Button>

    </Stack>

   </Stack>
   <TextField
    label="Search tasks"
    variant="outlined"
    size="small"
    className="mb-4 w-full"
    value={search}
    onChange={e => setSearch(e.target.value)}
   />
   {/* Додаємо фільтр по статусу */}
   <ToggleButtonGroup
    value={statusFilter}
    exclusive
    onChange={(e, val) => { if (val) setStatusFilter(val); }}
    size="small"
    className="mb-4"
   >
    <ToggleButton value="all">All</ToggleButton>
    <ToggleButton value="undone">Undone</ToggleButton>
    <ToggleButton value="done">Done</ToggleButton>
   </ToggleButtonGroup>
   <Stack spacing={2}>
    {filteredTasks.length > 0 ? (
     filteredTasks.map(t => (
      <Box key={t.id} className="flex items-center gap-2 bg-gray-50 rounded p-2">
       <Checkbox
        checked={t.status === "done"}
        onChange={() => handleToggle(t)}
        color="success"
       />
       <Box className="flex-1">
        <Typography
         variant="subtitle1"
         className={t.status === "done" ? "line-through text-gray-400" : ""}
        >
         {t.title}
        </Typography>
        {t.description && (
         <Typography variant="body2" color="text.secondary">
          {t.description}
         </Typography>
        )}
        <Stack direction="row" spacing={1} className="mt-1">
         {t.dueDate && (
          <Chip label={`Due: ${new Date(t.dueDate).toLocaleDateString()}`} size="small" />
         )}
         <Chip label={`Priority: ${t.priority}`} size="small" color="primary" />
         <Chip label={t.status} size="small" color={t.status === "done" ? "success" : "warning"} />
        </Stack>
       </Box>
       <IconButton color="info" onClick={() => handleEdit(t)}>
        <EditIcon />
       </IconButton>
       <IconButton color="error" onClick={() => handleDelete(t.id)}>
        <DeleteIcon />
       </IconButton>
      </Box>
     ))
    ) : (
     <Typography color="text.secondary" className="text-center">
      No tasks found.
     </Typography>
    )}
   </Stack>
   <AddTaskModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    categoryId={categoryId ?? getDefaultCategoryId()} // якщо не вибрано, підставляємо Basic
    task={editTask}
   />
  </Box>
 );
});

export default TaskList;