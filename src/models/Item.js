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
    default: 0,
  },
  category: {
    type: String,
    enum: ["fruits", "vegetables", "meat", "snacks and candy"],
    required: [true, "Please provide a category"],
  },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
