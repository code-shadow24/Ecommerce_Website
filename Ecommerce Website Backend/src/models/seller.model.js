import mongoose from "mongoose";
import bcrypt from "bcrypt";

const sellerSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    productCategories: {
      type: Array,
    },
    password: {
      type: String,
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    bankDetails: {
      accounttype: {
        type: String,
        enum: ["Current", "Savings"],
        required: true,
      },
      accountNumber: {
        type: Number,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
      IFSCCode: {
        type: String,
        required: true,
      },
    },
    avatar: {
      type: String,
    },
    socialMedia: [
      {
        accountName: {
          type: String,
        },
        accountURL: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14);
  next();
});

sellerSchema.methods.passwordChecker = async function (password) {
  return await bcrypt.compare(this.password, password);
};

sellerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_SECRET_TOKEN_EPIRY,
    }
  );
};

sellerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_SECRET_TOKEN_KEY,
    {
      expiresIn: process.env.REFRESH_SECRET_TOKEN_EPIRY,
    }
  );
};

export const Seller = mongoose.model("Seller", sellerSchema);
