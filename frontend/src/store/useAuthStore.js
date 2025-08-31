import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isLoggingOut: false,
    isCheckingAuth: true,    // This helps in loading - initially it's set to true
    profilePicResponse: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check")
            set({ authUser: response.data.data })
        }
        catch (error) {
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data, naviagte) => {
        set({ isSigningup: true });
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            toast.success(response.data.message);
            naviagte("/login")
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningup: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data.data })
            toast.success(response.data.message)
        }
        catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        const toastId = toast.loading("Logging out...")
        try {
            const response = await axiosInstance.post("/auth/logout");
            set({ authUser: null })
            toast.success(response.data.message)
        }
        catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            toast.dismiss(toastId)
            set({ isLoggingOut: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put("/auth/update/update-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({ profilePicResponse: response.data })
            set({ authUser: response.data.data })
            toast.success(response.data.message)
        }
        catch (error) {
            set({ profilePicResponse: error.message })
            console.error("Failed while updating the profile pic -> ", error.message);
            toast.error(error.response?.data?.message || "Something went wrong")
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    }
}))