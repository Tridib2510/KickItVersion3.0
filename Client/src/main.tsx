import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Toaster} from 'react-hot-toast'
import Profile from './Components/Profile/Profile.tsx'
import Layout from './Components/Layout.tsx'
import AllEvents from './Components/AllEvents/AllEvents.tsx'
import EventPage from './Components/EventInformation/EventInformation.tsx'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
    <Route path='' element={<App />} />
    <Route path='profile' element={<Profile/>} />
    <Route path='events' element={<AllEvents/>} />
    <Route path='events/:eventId' element={<EventPage/>}/>

    </Route>
    
      )
      )
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>,
)
