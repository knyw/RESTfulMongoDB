const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentsSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String },
        email: [String],
        courses: [String]
    }
);

module.exports = mongoose.model("students", StudentsSchema);