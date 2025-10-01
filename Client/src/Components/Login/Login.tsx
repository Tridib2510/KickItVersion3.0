import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import type { FormEvent } from 'react';
import { useAuthStore } from "../../store/Auth";
import toast from 'react-hot-toast';
import SignupPopup from "../SignUp/SignUp";
const LoginPopup = ({ Text }: { Text: string }) => {
  let setToken=useAuthStore(state=>state.setToken)
  let setUser=useAuthStore(state=>state.setUserId)
  const [isOpen, setIsOpen] = useState(false);

const BackendKey=import.meta.env.VITE_BACKEND_KEY

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
   

    interface LoginData {
      email: FormDataEntryValue | null,
      password: FormDataEntryValue | null
    }

    const data: LoginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    interface Options {
      method: string;
      credentials: RequestCredentials;//RequestCredentials includes 'include', 'same-origin', or 'omit'
      headers: {
        'Content-Type': string;
      };
      body: string;
    }



    const options:Options= {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    };

    

try {
      const res = await fetch(`${BackendKey}/KickIt/login`, options)
      
      const resData = await res.json()
      
       if(resData.status==='fail'){
      throw new Error(resData.message)
    }
    
    const resToken:string=resData.token
    console.log(resToken)
    setToken?.(resToken)
    const resId:string=resData.id
    setUser?.(resId)

    toast.success('Login successful!')
    setIsOpen(false)  
        window.location.reload()
} catch (error) {

  toast.error('Login failed! Please check your credentials.');
  
}  
finally{
  

}


}






  return (

    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl"
      >
        {Text}
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Box */}
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Welcome Back 👋
              </h2>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="********"
                    className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
                  />
                </div>

                <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  Login
                </Button>
              </form>

              {/* Footer */}
              <p className="text-sm text-gray-600 text-center mt-6">
                Don’t have an account?{" "}
                <a href="#" className="text-indigo-600 hover:underline"
                
                >
                  {<SignupPopup Text={'Sign Up'}
                  setIsLoginOpen={setIsOpen}
                  />}
                  
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginPopup;
