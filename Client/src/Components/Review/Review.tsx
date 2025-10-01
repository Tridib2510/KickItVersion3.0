import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';

interface Review{
  open:boolean,
  reviewer:string,
  setOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const ReviewPopup:React.FC<Review> = ({
  open,
  reviewer,
  setOpen
}) => {
  const BackendKey=import.meta.env.VITE_BACKEND_KEY

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState("");
  const { eventId } = useParams<{ eventId: string }>();

  const handleSubmit = () => {
    console.log({ rating, review });
    setOpen(false); // close popup after submit
    interface ReviewOptions{
      User:String,
      rating:number,
      review:String,
      sport:String,
      event:String|undefined
    }
  interface Options {
  method: string
  credentials: RequestCredentials
  headers: {
    "Content-Type": string
  }
  body:string
}


const reviewData:ReviewOptions={
   User:reviewer,
   rating:rating,
   review:review,
   sport:"Cricket",
   event:eventId
}


const options:Options={
  method:"POST",
  credentials:"include",
  headers:{
   "Content-Type": "application/json",
  }, 
  body:JSON.stringify({reviewData})
  

}

fetch(`${BackendKey}/KickIt/${reviewer}/Review/createReview`,options)
  .then(res=>res.json())
  .then(data=>{
    console.log(data)
     toast.success("Successfully created review")
  })
  .catch(err=>console.log(err))

    
  };

  return (
    <div className="flex justify-center mt-10">
      
      {/* Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Write Your Review
            </DialogTitle>
          </DialogHeader>

          {/* Rating Section */}
          <div className="flex gap-2 justify-center my-3">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <Star
                  key={i}
                  className={`w-7 h-7 cursor-pointer transition 
                    ${starValue <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(rating)}
                />
              );
            })}
          </div>

          {/* Text Area */}
          <Textarea
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full min-h-[120px]"
          />

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewPopup;
