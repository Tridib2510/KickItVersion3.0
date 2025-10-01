import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import  {immer} from 'zustand/middleware/immer';

interface AuthState{
    mode?: 'light' | 'dark';
    token?:string;
    userId?:string;
    setToken?:(token:string)=>void
    setUserId?:(token:string)=>void;
    setMode?:(newMode:string)=>void;
    
}
export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      mode: 'light',
      token: '',
      userId: '',
      setMode:(newMode:string)=>{
            set(state=>{
                state.mode=newMode as 'light' | 'dark'
            })
        },
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),
      setUserId: (userId) =>
        set((state) => {
          state.userId = userId;
        }),
    })),
    {
      name: 'auth-preferences',
    }
  )
);

