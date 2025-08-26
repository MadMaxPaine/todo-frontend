"use client";
import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { ctx } from "../stores/Context";
import {
 Dialog, DialogTitle, DialogContent, DialogActions,
 Button, TextField, MenuItem, Stack
} from "@mui/material";

const statusOptions = [
 { value: "undone", label: "Undone" },
 { value: "done", label: "Done" },
];

const AddTaskModal = observer(({ open, onClose, categoryId, task: editTask }) => {
 const { user, task } = React.useContext(ctx);
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [dueDate, setDueDate] = useState("");
 const [priority, setPriority] = useState(5);
 const [status, setStatus] = useState("undone");

 // Заповнюємо поля при відкритті модалки для редагування
 React.useEffect(() => {
  if (open && editTask) {
   setTitle(editTask.title || "");
   setDescription(editTask.description || "");
   setDueDate(editTask.dueDate ? editTask.dueDate.slice(0, 10) : "");
   setPriority(editTask.priority ?? 5);
   setStatus(editTask.status || "undone");
  }
  if (open && !editTask) {
   setTitle("");
   setDescription("");
   setDueDate("");
   setPriority(5);
   setStatus("undone");
  }
 }, [open, editTask]);

 const handleSave = async () => {
  const payload = {
   title,
   description,
   priority,
   status,
   categoryId,
   userId: user.user.id,
   dueDate: dueDate ? dueDate : null,
  };
  if (dueDate) payload.dueDate = dueDate; // додаємо тільки якщо є дата

  if (editTask) {
   await task.updateTask(editTask.id, payload);
  } else {
   await task.addTask(payload);
  }
  onClose();
 };
 return (
  <Dialog open={open} onClose={onClose}>
   <DialogTitle>{editTask ? "Edit Task" : "Add Task"}</DialogTitle>
   <DialogContent>
    <Stack spacing={2} sx={{ mt: 1 }}>
     <TextField
      label="Title"
      value={title}
      onChange={e => setTitle(e.target.value)}
      required
     />
     <TextField
      label="Description"
      value={description}
      onChange={e => setDescription(e.target.value)}
      multiline
      rows={2}
     />
     <TextField
      label="Due Date"
      type="date"
      value={dueDate}
      onChange={e => setDueDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
     />
     <TextField
      label="Priority"
      type="number"
      value={priority}
      onChange={e => setPriority(Number(e.target.value))}
      inputProps={{ min: 1, max: 10 }}
     />
     <TextField
      select
      label="Status"
      value={status}
      onChange={e => setStatus(e.target.value)}
     >
      {statusOptions.map(opt => (
       <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
      ))}
     </TextField>
    </Stack>
   </DialogContent>
   <DialogActions>
    <Button onClick={onClose} color="inherit">Cancel</Button>
    <Button onClick={handleSave} variant="contained" color="primary">
     {editTask ? "Save" : "Add"}
    </Button>
   </DialogActions>
  </Dialog>
 );
});
export default AddTaskModal;