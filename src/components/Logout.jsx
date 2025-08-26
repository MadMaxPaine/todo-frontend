"use client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import React from "react";
import { ctx } from "../stores/Context";
import Button from "@mui/material/Button";

const LogoutButton = observer(() => {
  const { user } = React.useContext(ctx);
  const router = useRouter();

  const handleLogout = async () => {
    await user.logout();
    router.push("/"); // перенаправлення на головну сторінку
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
});

export default LogoutButton;