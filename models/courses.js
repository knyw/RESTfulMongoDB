const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoursesSchema = new Schema(
    {
        courseCode: { type: String, required: true },
        courseName: { type: String, required: true },
        semester: { type: String },
        location: { type: String }
    }
);

module.exports = mongoose.model("courses", CoursesSchema);