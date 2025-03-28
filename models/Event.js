import { Schema, model } from "mongoose";

const EventSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxTickets: { type: Number, required: true },
}, { timestamps: true });

export default model("Event", EventSchema);
