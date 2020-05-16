/**
 * Created on November 10, 2019
 * @author Kenny Wu
 */
const express = require("express");
const router = express.Router();
const MainModule = require("../app");

const Account = require("../models/accounts");
const Course = require("../models/courses");
const Instructor = require("../models/instructors");
const Student = require("../models/students");


router.get("/signin", function (req, res) {
    if (Object.keys(req.body).length === 0 || req.body.email == null || req.body.password == null) {
        res.status(400).send("Invalid input!");
    } else {
        Account.findOne({ email: req.body.email }, function (err, account) {
            if (err) {
                res.status(404).send(err);
            } else if (account == null) {
                res.status(400).send("Not Found!");
            } else {
                if (req.body.password === account.password) {
                    res.status(200).send("Success!");
                } else {
                    res.status(400).send("Invalid password!");
                }
            }
        });
    }
});


router.post("/instructor", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Please provide a value!");
    } else {
        let instructor = new Instructor(req.body);
        instructor.save(function (err, instructor) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/instructor/" + instructor._id;
                results.message = "";
                results.data = instructor;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }

});


router.get("/instructor", function (req, res) {
    var courseCode = req.query.coursecode;
    
    if (courseCode == null || courseCode == "") {
        Instructor.find({}, function (err, instructors) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/instructor";
                results.message = "";
                results.data = instructors;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    } else {
        Instructor.find({ courses: courseCode }, function (err, instructors) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/instructor?courseCode=" + courseCode;
                results.message = "";
                results.data = instructors;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }
});

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
            res.set("Content-Type", "application/json");
            res.json(results);
            res.status(200).end();
        }
    });
});

router.put("/instructor/:instructorID", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Invalid input!");
    } else {
        Instructor.findById(req.params.instructorID, function (err, instructor) {
            if (err) {
                res.status(404).send(err);
            } else if (instructor == null) {
                res.status(400).send("Invalid instructor ID!");
            } else {
                instructor.firstName = req.body.firstName;
                instructor.lastName = req.body.lastName;
                instructor.email = req.body.email;
                instructor.courses = req.body.courses;
                instructor.save();
                
                var results = {};
                results.link = "/api/instructor/" + instructor._id;
                results.message = "";
                results.data = instructor;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }

});

router.delete("/instructor/:instructorID", function (req, res) {
    Instructor.findById(req.params.instructorID, function (err, instructor) {
        if (err) {
            res.status(404).send(err);
        } else if (instructor == null) {
            res.status(400).send("Invalid instructor ID!");
        } else {
            instructor.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send("Removed!");
                }
            });
        }
    });
});


router.post("/student", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Please provide a value!");
        status = "400 Bad Request";
    } else {
        let student = new Student(req.body);
        student.save(function (err, student) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/student/" + student._id;
                results.message = "";
                results.data = student;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }
});

router.post("/student-collection", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Please provide some value!");
        status = "400 Bad Request";
    } else {
        Student.insertMany(req.body, function (err, students) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/student/student-collection";
                results.message = "";
                results.data = students;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }
});

router.get("/student", function (req, res) {
    var courseCode = req.query.coursecode;
    var gender = req.query.gender;

    if (courseCode == null || courseCode == "") {
        if (gender == null || gender == "") {
            Student.find({}, function (err, students) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    var results = {};
                    results.link = "/api/student";
                    results.message = "";
                    results.data = students;
                    res.set("Content-Type", "application/json");
                    res.json(results);
                    res.status(200).end();
                }
            });
        } else {
            Student.find({ gender: gender }, function (err, students) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    var results = {};
                    results.link = "/api/student";
                    results.message = "";
                    results.data = students;
                    res.set("Content-Type", "application/json");
                    res.json(results);
                    res.status(200).end();
                }
            });
        }
    } else {
        if (gender == null || gender == "") {
            Student.find({ courses: courseCode }, function (err, students) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    var results = {};
                    results.link = "/api/student?courseCode=" + courseCode;
                    results.message = "";
                    results.data = students;
                    res.set("Content-Type", "application/json");
                    res.json(results);
                    res.status(200).end();
                }
            });
        } else {
            Student.find({ courses: courseCode, gender: gender }, function (err, students) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    var results = {};
                    results.link = "/api/student?courseCode=" + courseCode + "?gender=" + gender;
                    results.message = "";
                    results.data = students;
                    res.set("Content-Type", "application/json");
                    res.json(results);
                    res.status(200).end();
                }
            });
        }
    }
});


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
            res.set("Content-Type", "application/json");
            res.json(results);
            res.status(200).end();
        }
    });
});

router.get("/student/:studentID/email", function (req, res) {
    Student.findById(req.params.studentID, function (err, student) {
        if (err) {
            res.status(404).send(err);
        } else if (student == null) {
            res.status(400).send("Not Found!");
        } else {
            var results = {};
            results.link = "/api/student/" + student._id;
            results.message = "";
            results.data = student.email;
            res.set("Content-Type", "application/json");
            res.json(results);
            res.status(200).end();
        }
    });
});

router.put("/student/:studentID", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Invalid input!");
    } else {
        Student.findById(req.params.studentID, function (err, student) {
            if (err) {
                res.status(404).send(err);
            } else if (student == null) {
                res.status(400).send("Invalid student ID!");
            } else {
                student.firstName = req.body.firstName;
                student.lastName = req.body.lastName;
                student.gender = req.body.gender;
                student.email = req.body.email;
                student.courses = req.body.courses;
                student.save();
                
                var results = {};
                results.link = "/api/student/" + student._id;
                results.message = "";
                results.data = student;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }

});

router.delete("/student/:studentID", function (req, res) {
    Student.findById(req.params.studentID, function (err, student) {
        if (err) {
            res.status(404).send(err);
        } else if (student == null) {
            res.status(400).send("Invalid student ID!");
        } else {
            student.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send("Removed!");
                }
            });
        }
    });
});


router.post("/course", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Please provide a value!");
        status = "400 Bad Request";
    } else {
        let course = new Course(req.body);
        course.save(function (err, course) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/course/" + course._id;
                results.message = "";
                results.data = course;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }

});

router.get("/course", function (req, res) {
    var semester = req.query.semester;
    
    if (semester == null || semester == "") {
        Course.find({}, function (err, courses) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/course";
                results.message = "";
                results.data = courses;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    } else {
        Course.find({ semester: semester }, function (err, courses) {
            if (err) {
                res.status(404).send(err);
            } else {
                var results = {};
                results.link = "/api/course?semester=" + semester;
                results.message = "";
                results.data = courses;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }
});

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
            res.set("Content-Type", "application/json");
            res.json(results);
            res.status(200).end();
        }
    });
});

router.put("/course/:courseID", function (req, res) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).send("Invalid input!");
    } else {
        Course.findById(req.params.courseID, function (err, course) {
            if (err) {
                res.status(404).send(err);
            } else if (course == null) {
                res.status(400).send("Invalid course ID!");
            } else {
                course.courseCode = req.body.courseCode;
                course.courseName = req.body.courseName;
                course.semester = req.body.semester;
                course.location = req.body.location;
                course.save();
                
                var results = {};
                results.link = "/api/course/" + course._id;
                results.message = "";
                results.data = course;
                res.set("Content-Type", "application/json");
                res.json(results);
                res.status(200).end();
            }
        });
    }
});

router.delete("/course/:courseID", function (req, res) {
    Course.findById(req.params.courseID, function (err, course) {
        if (err) {
            res.status(404).send(err);
        } else if (course == null) {
            res.status(400).send("Invalid course ID!");
        } else {
            course.remove(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send("Removed!");
                }
            });
        }
    });
});

router.get("/list", function (req, res) {
    if (MainModule.collection.length != 0) {
        res.set("Content-Type", "application/json");
        res.json(MainModule.collection);
        res.status(200).end();
    } else {
        res.status(400).send("Connection Error!");
    }
})

module.exports = router;