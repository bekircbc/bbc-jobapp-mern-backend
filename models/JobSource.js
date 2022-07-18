import mongoose from "mongoose";

const jobSourceSchema = new mongoose.Schema({
  name: String,
  url: String,
});

export const JobSource = mongoose.model("job-source", jobSourceSchema);
