import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function() { return this.status != "Guest" },
        trim: true
    },
    email: {
        type: String,
        required: function() { return this.status != "Guest" },
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: function() { return this.status != "Guest" },
        trim: true
    },
    password: {
        type: String,
        required: function() { return this.status != "Guest" },
        minlength: 6,
        select: false
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
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number }
        }
    ],
    wishlist: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
        }
    ],
    walletBalance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Password check method
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
