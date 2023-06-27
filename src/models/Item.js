import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide an item name."],
  },
  userId: {
    type: String,
    required: [true, "Please provide an user id"],
  },
  amount: {
    type: Number,
  },
});

export default mongoose.model("Item", ItemSchema);
