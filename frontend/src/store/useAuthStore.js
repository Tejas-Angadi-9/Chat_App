import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,    // This helps in loading - initially it's set to true

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            console.log("RESPONSE: ", res)
            set({ authUser: res })
        }
        catch (error) {
            set({ authUser: null })
        }
        finally {
            set({ isCheckingAuth: false })
        }
    }
}))