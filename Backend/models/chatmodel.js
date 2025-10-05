const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

const chatSchema = new mongoose.Schema(
  {
    // The ID of the sender (usually a User _id)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName:{
      type:String,
    },

    // The ID of the receiver (can be another user or a group)
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Group" if you support group chats
      required: true,
    },

    // The actual message text
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Message read status
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);



const Chat = mongoose.model("Chat", chatSchema);
module.exports=Chat