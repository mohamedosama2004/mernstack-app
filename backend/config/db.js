import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Database connected");
  } catch (error) {
    console.error("Error connecting the database", error);
    process.exit(1); //exit with failure
  }
};
