import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    status: {
        type: String,
        enum: ["Guest", "Approved", "Restricted", "Deleted", "Unverified"],
        default: "Unverified"
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: {
        type: Array,
        default: []
    },
    walletBalance: {
        type: Number,
        default: 0
    }
})

const userModel = mongoose.model("User", userSchema);

export default userModel;