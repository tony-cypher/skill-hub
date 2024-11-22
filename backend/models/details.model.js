import mongoose from "mongoose";

const detailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  city: {
    type: String,
    default: "",
  },
  lga: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  work: {
    type: String,
    default: "",
  },
  service: {
    type: String,
    default: "",
  },
});

const Detail = mongoose.model("Detail", detailSchema);

export default Detail;
