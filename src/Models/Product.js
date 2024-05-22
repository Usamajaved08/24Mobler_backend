import mongoose from "mongoose";
const { Schema } = mongoose;

const dimensionSchema = new Schema({
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  depth: {
    type: Number,
  },
});

const locationSchema = new Schema({
  street: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});

const productSchema = new Schema(
  {
    posterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    condition: {
      type: String,
    },
    isQualityVerified: {
      type: Boolean,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    bonusDiscount: {
      type: Number,
    },
    deliveryPrice: {
      type: Number,
    },
    addOns: {
      type: [
        {
          item: { type: String },
          price: { type: Number, default: 0 },
          number: { type: Number, default: 0 },
          discount: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    color: {
      type: String,
      required: true,
    },
    imageNames: {
      type: [String],
      default: null,
    },
    starRating: {
      type: Number,
      default: null,
    },
    category: {
      // type: Schema.Types.ObjectId,
      // ref: 'Category',
      type: String,
      default: null,
    },
    rooms: {
      type: [String],
      default: null,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        default: null,
      },
    ],
    model: {
      type: String,
    },
    description: {
      type: String,
    },
    dimension: {
      type: dimensionSchema,
    },
    location: {
      type: locationSchema,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "declined",
        "preApproved",
        "sold",
        "deliveryApproved",
      ],
      default: "pending",
    },
    movingDiscount: {
      type: [Number],
      default: [1, 0.95, 0.85, 0.75, 0.65],
    },
    pickUpSlots: {
      type: Array,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
