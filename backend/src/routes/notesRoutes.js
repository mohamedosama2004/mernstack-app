import express from "express";
import { createNote, deleteNote, getAllNotes, getANoteByID, updateNote } from "../controllers/notesControllers.js";
const router = express.Router();

router.get("/",getAllNotes );
router.get("/:id",getANoteByID );
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;

// app.get('/api/notes' ,(req,res)=>{
//     res.status(200).send('2احلي مسا يا دولي 3232  ')
// })

// app.post('/api/notes' , (req,res)=>{
//     res.status(201).json({
//         message:"post created successfully "
//     })
// })
// app.put('/api/notes/:id' , (req,res)=>{
//     res.status(200).json({
//         message:"post updated successfully "
//     })
// })
// app.delete('/api/notes/:id' , (req,res)=>{
//     res.status(200).json({
//         message:"Node Deletes successfully "
//     })
// })
