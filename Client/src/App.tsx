import Price from './Components/Price/Price'
import Events from './Components/Events/Events'
import About from './Components/About/About'
import './App.css'
import Hero from './Components/Hero/Hero'
import {HorizontalTweetCommentsWhite} from './Components/SiteReview/SiteReview'
function App() {
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
