const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  imgs: {
    type: [
      {
        _id: { type: ObjectId, auto: true },
        url: { type: String, required: true },
      },
    ],
    required: true,
  },
  price: { type: Number, required: true },
  price2: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variants: {
    type: [
      {
        attributes: {
          size: { type: String, required: true },
          color: { type: String, required: true },
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        sku: { type: String },
        img: { type: String },
      },
    ],
    default: [],
  },
  category: {
    type: {
      categoryId: { type: ObjectId, required: true },
      categoryName: { type: String, required: true },
    },
    required: true,
  },
  hot: { type: Number, required: false },
  view: { type: Number, required: false },
  shortDescription: { type: String, required: false },
  longDescription: { type: String, required: false },
});

module.exports =
  mongoose.models.product || mongoose.model("product", productSchema);
