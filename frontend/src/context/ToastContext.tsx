// src/context/ToastContext.ts
import { createContext } from "react";

// Định nghĩa lại các Interface cần thiết
export interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

// Tạo Context và export
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
