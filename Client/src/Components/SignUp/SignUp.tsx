import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import type { FormEvent } from "react";
import { useAuthStore} from "../../store/Auth";
import toast from "react-hot-toast";
const BackendKey=import.meta.env.VITE_BACKEND_KEY

interface SignUp{
    Text:string,
    setIsLoginOpen:React.Dispatch<React.SetStateAction<boolean>>
}

const SignupPopup = ({ Text,setIsLoginOpen}:SignUp) => {
  const setToken = useAuthStore((state) => state.setToken);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    interface SignupData {
      username: FormDataEntryValue | null;
      email: FormDataEntryValue | null;
      password: FormDataEntryValue | null;
      confirm_password:FormDataEntryValue|null
    }

    const data: SignupData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirm_password:formData.get("confirm_password")
    };

    const options: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    };

    try {
      const res = await fetch(
        `${BackendKey}/KickIt/signUp`,
        options
      );
      const resData = await res.json();

      if (resData.status === "fail") {
        throw new Error(resData.message);
      }

      console.log(resData);
      const resToken: string = resData.token;
      setToken?.(resToken);

      toast.success("Signup successful! 🎉");
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Signup failed! Try again.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <a
        onClick={() => setIsOpen(true)}
        
      >
        {Text}
      </a>

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
                onClick={() =>{
                     setIsOpen(false)
                     setIsLoginOpen(false)
                }
                    }
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Create an Account ✨
              </h2>

              {/* Form */}
<form onSubmit={onSubmit} className="space-y-5">
  <div>
    <label className="block text-sm font-medium text-gray-700 text-left">
      Username
    </label>
    <input
      name="username"
      type="text"
      placeholder="John Doe"
      required
      className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 text-left">
      Email
    </label>
    <input
      name="email"
      type="email"
      placeholder="you@example.com"
      required
      className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 text-left">
      Password
    </label>
    <input
      name="password"
      type="password"
      placeholder="********"
      required
      className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
    />
  </div>

    <div>
    <label className="block text-sm font-medium text-gray-700 text-left">
      Confirm Password
    </label>
    <input
      name="confirm_password"
      type="password"
      placeholder="********"
      required
      className="w-full mt-2 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
    />
  </div>

  <Button className="w-full rounded-xl bg-green-600 hover:bg-green-700">
    Sign Up
  </Button>
</form>


              {/* Footer */}
              <p className="text-sm text-gray-600 text-center mt-6">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-green-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false); // close signup
                  }}
                >
                  Login
                </a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignupPopup;
