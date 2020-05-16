/**
 * Created on November 10, 2019
 * @author Kenny Wu
 */
const express = require("express");
const router = express.Router();
const MainModule = require("../app");

const Course = require("../models/courses");
const Instructor = require("../models/instructors");
const Student = require("../models/students");

router.get("/instructor/:instructorID", function (req, res) {
    Instructor.findById(req.params.instructorID, function (err, instructor) {
        if (err) {
            res.status(404).send(err);
        } else if (instructor == null) {
            res.status(400).send("Not Found!");
        } else {
            var results = {};
            results.link = "/api/instructor/" + instructor._id;
            results.message = "";
            results.data = instructor;
            status = "200 OK";  
            res.render("resultget", {
                originalResult: JSON.stringify(results, null, 4),
                head: "HTTP/1.1",
                status: status,
                type: "application/json",
                link: results.link,
                data: instructor.toObject()
            });
        }
    });

})

router.get("/student/:studentID", function (req, res) {
    Student.findById(req.params.studentID, function (err, student) {
        if (err) {
            res.status(404).send(err);
        } else if (student == null) {
            res.status(400).send("Not Found!");
        } else {
            var results = {};
            results.link = "/api/student/" + student._id;
            results.message = "";
            results.data = student;
            status = "200 OK";  
            res.render("resultget", {
                originalResult: JSON.stringify(results, null, 4),
                head: "HTTP/1.1",
                status: status,
                type: "application/json",
                link: results.link,
                data: student.toObject()
            });
        }
    });
})

router.get("/course/:courseID", function (req, res) {
    Course.findById(req.params.courseID, function (err, course) {
        if (err) {
            res.status(404).send(err);
        } else if (course == null) {
            res.status(400).send("Not Found!");
        } else {
            var results = {};
            results.link = "/api/course/" + course._id;
            results.message = "";
            results.data = course;
            status = "200 OK";  
            res.render("resultget", {
                originalResult: JSON.stringify(results, null, 4),
                head: "HTTP/1.1",
                status: status,
                type: "application/json",
                link: results.link,
                data: course.toObject()
            });
        }
    });
})

router.get("/list", function (req, res) {
    if (req.query.resource != null) {
        if (req.query.resource == "students" || req.query.resource == "courses" || req.query.resource == "instructors") {
            if (req.query.resource == "students") {
                Student.find({}, function (err, students) {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        var name = "Student List";
                        res.render("returnlist", {
                            name: name,
                            data: students
                        });
                    }
                }).lean();
            }
            if (req.query.resource == "courses") {
                Course.find({}, function (err, courses) {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        var name = "Course List";
                        res.render("returnlist", {
                            name: name,
                            data: courses
                        });
                    }
                }).lean();
            }
            if (req.query.resource == "instructors") {
                Instructor.find({}, function (err, instructors) {
                    if (err) {
                        res.status(404).send(err);
                    } else {
                        var name = "Instructor List";
                        res.render("returnlist", {
                            name: name,
                            data: instructors
                        });
                    }
                }).lean();
            }
            return;
        } else {
            res.status(400).send("Invalid query parameter!");
            return;
        }
    }


    if (MainModule.collection.length != 0) {
        status = "200 OK";
        res.render("resultget", {
            originalResult: JSON.stringify(MainModule.collection, null, 4),
            head: "HTTP/1.1",
            status: status,
            type: "application/json",
            link: "/api/list",
            data: MainModule.collection
        });
    } else {
        res.status(400).send("Connection Error!");
    }
})



module.exports = router;