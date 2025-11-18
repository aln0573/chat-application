// frontend/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningup: false,
  isLoggedIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      if (res.data) get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningup: false });
    }
  },

  login: async (data) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggedIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      get().disconnectSocket();
      set({ authUser: null, onlineUsers: [] });

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser) return;

    if (socket) return; 

    const newSocket = io(BASE_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("🔥 CLIENT CONNECTED:", newSocket.id);
    });

    newSocket.on("onlineUsers", (users) => {
      console.log("🟢 Online Users:", users);
      set({ onlineUsers: users });
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 CLIENT DISCONNECTED");
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
