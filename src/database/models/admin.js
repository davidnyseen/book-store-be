import mongoose, { Schema } from "mongoose"

const addressSchema = new Schema({
  isPrimary: {
    type: Boolean,
    default: false
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }
})

const AddressModel = mongoose.model("Address", addressSchema)
export default AddressModel
