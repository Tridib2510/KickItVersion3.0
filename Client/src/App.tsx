import Price from './Components/Price/Price'
import Events from './Components/Events/Events'
import About from './Components/About/About'
import './App.css'
import { useAuthStore } from "./store/Auth";
const BackendKey=import.meta.env.VITE_BACKEND_KEY
import Hero from './Components/Hero/Hero'
import {HorizontalTweetCommentsWhite} from './Components/SiteReview/SiteReview'
import { useEffect } from 'react';
function App() {
  const setUserId = useAuthStore((state) => state.setUserId);
  const setToken=useAuthStore((state)=>state.setToken)
  useEffect(()=>{
   const token=async()=>{
     try {
      const response=await await fetch(`${BackendKey}/KickIt/isLoggedIn`,{
      credentials:'include'
    }) 
    const data=await response.json()
    console.log("Token data:", data);
    if(data.status==='fail'){
    setUserId?.("");
    setToken?.("")
    }
     } catch (error) {
      console.log(error)
     }
   }
  token()
  },[])
  return (
    <>
      <Hero />
       <About />
      <Events />
      <HorizontalTweetCommentsWhite/>
       <Price />
      
    </>
  )
}

export default App
