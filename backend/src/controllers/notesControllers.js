import Note from "../../models/Note.js";

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getANoteByID = async (req, res) => {
  try {
    const specificNote = await Note.findById(req.params.id);
    if(!specificNote) return res.status(404).json({message :"Note not Found"})
    res.status(200).json(specificNote);
  } catch (error) {
    console.error("Error in getANoteByID controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    const savedNotes = await note.save();
    res.status(201).json(savedNotes);
    // console.log(title ,content)
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      {
        new: true,
      },
    );

    if (!updatedNote)
      return res.status(404).json({
        message: "Note not found",
      });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({
        message: "Note not found",
      });
    res.status(200).json(deletedNote);
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
