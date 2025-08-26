"use client";
import { StoreProvider } from "../stores/Context";

export default function ClientLayout({ children }) {
  return (
    <StoreProvider>
      <main>
        {children}
      </main>
    </StoreProvider>
  );
}