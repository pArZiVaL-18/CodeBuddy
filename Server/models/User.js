// // models/User.js (ESM)
// import crypto from "crypto";
// import mongoose from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please tell us your name!"],
//     },
//     email: {
//         type: String,
//         required: [true, "Please provide your email"],
//         unique: true,
//         lowercase: true,
//         validate: [validator.isEmail, "Please provide a valid email"],
//     },
//     photo: String,
//     role: {
//         type: String,
//         enum: ["user", "guide", "lead-guide", "admin"],
//         default: "user",
//     },
//     password: {
//         type: String,
//         required: [true, "Please provide a password"],
//         minlength: 8,
//         select: false,
//     },
//     passwordConfirm: {
//         type: String,
//         required: [true, "Please confirm your password"],
//         validate: {
//             // This only works on CREATE and SAVE!!!
//             validator: function (el) {
//                 return el === this.password;
//             },
//             message: "Passwords are not the same!",
//         },
//     },
//     passwordChangedAt: Date,
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     active: {
//         type: Boolean,
//         default: true,
//         select: false,
//     },

//     problemSolved: {
//         type: Number,
//         default: 0,
//         min: 0,
//     },
//     rank: {
//         type: Number,
//         default: 0,
//         min: 0,
//     },
//     score: {
//         type: Number,
//         default: 0,
//         min: 0,
//     },
// });

// userSchema.pre("save", async function (next) {
//     // Only run this function if password was actually modified
//     if (!this.isModified("password")) return next();

//     // Hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);

//     // Delete passwordConfirm field
//     this.passwordConfirm = undefined;

//     next();
// });

// userSchema.pre("save", function (next) {
//     if (!this.isModified("password") || this.isNew) return next();

//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });

// userSchema.pre(/^find/, function (next) {
//     // this points to the current query
//     this.find({ active: { $ne: false } });
//     next();
// });

// userSchema.methods.correctPassword = async function (
//     candidatePassword,
//     userPassword
// ) {
//     return await bcrypt.compare(candidatePassword, userPassword);
// };

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//     if (this.passwordChangedAt) {
//         const changedTimestamp = parseInt(
//             this.passwordChangedAt.getTime() / 1000,
//             10
//         );
//         return JWTTimestamp < changedTimestamp;
//     }
//     // False means NOT changed
//     return false;
// };

// userSchema.methods.createPasswordResetToken = function () {
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     this.passwordResetToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//     // Expires in 10 minutes
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

// const User = mongoose.model("User", userSchema);

// export default User;

// models/User.js (ESM)
import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please tell us your name!"],
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        photo: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords are not the same!",
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },

        problemSolved: {
            type: Number,
            default: 0,
            min: 0,
        },
        score: {
            type: Number,
            default: 0,
            min: 0,
        },
        solvedProblems: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 🔹 Virtual field: level
userSchema.virtual("level").get(function () {
    if (this.score < 100) return "Beginner";
    if (this.score < 500) return "Intermediate";
    if (this.score < 1000) return "Advanced";
    return "Master";
});

// 🔹 Instance method: compute rank dynamically
userSchema.methods.getRank = async function () {
    const User = this.constructor;

    // Count how many users have a higher score
    const higherRankCount = await User.countDocuments({
        score: { $gt: this.score },
    });

    // Rank is (#users with higher score) + 1
    return higherRankCount + 1;
};

// Existing pre-save hooks + methods (unchanged)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
