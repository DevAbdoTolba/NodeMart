import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function() {return this.status != "Guest"},
        trim: true
    },
    email: {
        type: String,
        required: function() {return this.status != "Guest"},
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: function() {return this.status != "Guest"},
        trim: true
    },
    password: {
        type: String,
        required: function() {return this.status != "Guest"}
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