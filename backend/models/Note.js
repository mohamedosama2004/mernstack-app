import mongoose from "mongoose";

// 1- create schema
// 2- model based off of that schema

const noteSchema = new mongoose.Schema( 
    // step 1 create your schema using (mongoose.Schema) 
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// step 2 make a model of the schema you just created (mongoose.model("Note", noteSchema))
const Note = mongoose.model("Note", noteSchema);
export default Note;
