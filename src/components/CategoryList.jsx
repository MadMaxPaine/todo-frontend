"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ctx } from "../stores/Context";
import { Button, TextField, Box, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryList = observer(({ onSelect, selectedId }) => {
 const { category } = React.useContext(ctx);
 const [newName, setNewName] = useState("");
 const [editId, setEditId] = useState(null);
 const [editName, setEditName] = useState("");

 useEffect(() => {
  category.fetchCategories();
 }, [category]);

 const handleAdd = async () => {
  if (newName.trim()) {
   await category.addCategory(newName.trim());
   setNewName("");
  }
 };

 const handleDelete = async (id) => {
  await category.removeCategory(id);
 };

 const handleEdit = (cat) => {
  setEditId(cat.id);
  setEditName(cat.name);
 };

 const handleUpdate = async () => {
  if (editName.trim()) {
   await category.updateCategory(editId, editName.trim());
   setEditId(null);
   setEditName("");
  }
 };

 if (category.isLoading) return <Typography>Loading categories...</Typography>;
 if (category.error) return <Typography color="error">{category.error}</Typography>;

 return (
  <Box className="mt-8 w-1/3 min-w-[250px]">
   <Typography variant="h6" className="mb-4 font-bold text-center">Categories</Typography>
   <Stack direction="row" spacing={2} className="mb-4">
    <TextField
     label="New category"
     value={newName}
     onChange={e => setNewName(e.target.value)}
     size="small"
    />
    <Button variant="contained" color="primary" onClick={handleAdd}>
     Add
    </Button>
   </Stack>
   <Stack spacing={2}>
    {(category.categories ?? []).map(cat => (
     <Box key={cat.id} className="flex items-center gap-2">
      {editId === cat.id ? (
       <>
        <TextField
         value={editName}
         onChange={e => setEditName(e.target.value)}
         size="small"
        />
        <Button variant="contained" color="success" onClick={handleUpdate}>
         Save
        </Button>
        <Button variant="outlined" color="inherit" onClick={() => setEditId(null)}>
         Cancel
        </Button>
       </>
      ) : (
       <>
        <Button
         variant="text"
         className="flex-1 text-left truncate px-2"
         onClick={() => onSelect(cat.id)}
         sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          fontWeight: 400,
          fontSize: 16,
          minWidth: 0,
         }}
        >
         {cat.name}
        </Button>
        <Button
         variant="outlined"
         color="info"
         onClick={() => handleEdit(cat)}
         sx={{ minWidth: 0, padding: 1 }}
        >
         <EditIcon />
        </Button>
        <Button
         variant="outlined"
         color="error"
         onClick={() => handleDelete(cat.id)}
         sx={{ minWidth: 0, padding: 1 }}
        >
         <DeleteIcon />
        </Button>
       </>
      )}
     </Box>
    ))}
   </Stack>
  </Box>
 );
});

export default CategoryList;