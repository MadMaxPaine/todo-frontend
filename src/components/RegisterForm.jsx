"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { ctx } from "../stores/Context";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
const RegisterForm = observer(() => {
 const { user } = React.useContext(ctx);
 const router = useRouter();
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);

 useEffect(() => {
  let timer;
  if (message) {
   timer = setTimeout(() => setMessage(""), 3000);
  }
  return () => clearTimeout(timer);
 }, [message]);

 useEffect(() => {
  if (user.isAuth) {
   router.push("/main"); // автоматичний редирект на головну
  }
 }, [user.isAuth, router]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  await user.registration({ username, password });
  setLoading(false);
  if (user.isAuth) {
   setMessage("Registration successful!");
  } else {
   setMessage(user.error || "Registration error!");
  }
 };

 return (
  <Box
   component="form"
   onSubmit={handleSubmit}
   className="flex flex-col gap-4 justify-center items-center min-h-screen max-w-md mx-auto"
  >
   <Typography variant="subtitle1" align="center" className="w-full">Username</Typography>
   <TextField
    variant="filled"
    value={username}
    onChange={e => setUsername(e.target.value)}
    required
    sx={{ input: { backgroundColor: "#fff" } }}
    disabled={loading}
    className="w-full"
   />
   <Typography variant="subtitle1" align="center" className="w-full">Password</Typography>
   <TextField
    type="password"
    variant="filled"
    value={password}
    onChange={e => setPassword(e.target.value)}
    required
    sx={{ input: { backgroundColor: "#fff" } }}
    disabled={loading}
    className="w-full"
   />
   <Button
    type="submit"
    variant="contained"
    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
    disabled={loading}
   >
    {loading ? <CircularProgress size={24} color="inherit" /> : "Enter"}
   </Button>
   {message && (
    <div className={user.isAuth ? "text-green-500" : "text-red-500"}>
     {message}
    </div>
   )}
  </Box>
 );
});

export default RegisterForm;