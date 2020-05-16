const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstructorsSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String },
        courses: [String]
    }
);

module.exports = mongoose.model("instructors", InstructorsSchema);