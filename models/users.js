const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const uuidv4 = require("uuid/v4");

const UsersSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  validationToken: {
    type: String,
    required: true,
  },
  numTel: {
    type: Number,
    required: false,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UsersSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.validationToken = uuidv4();
    const salt = await bcryptjs.genSalt(10);
    this.password = bcryptjs.hashSync(this.password, salt);
  }
  next();
});

module.exports = mongoose.model("users", UsersSchema);
