const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for demo (replace with database in production)
let students = [];
let assessments = [];

// Validation schemas
const studentSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  age: Joi.number().integer().min(3).max(18).required(),
  grade: Joi.string().required(),
  email: Joi.string().email().optional(),
  dateOfBirth: Joi.date().optional(),
  parentEmail: Joi.string().email().optional(),
  parentPhone: Joi.string().optional()
});

const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  age: Joi.number().integer().min(3).max(18).optional(),
  grade: Joi.string().optional(),
  email: Joi.string().email().optional(),
  dateOfBirth: Joi.date().optional(),
  parentEmail: Joi.string().email().optional(),
  parentPhone: Joi.string().optional()
});

/**
 * @route GET /api/v1/students
 * @desc Get all students
 * @access Public
 */
router.get('/', (req, res) => {
  const { page = 1, limit = 10, grade, search } = req.query;
  
  let filteredStudents = students;
  
  // Filter by grade if provided
  if (grade) {
    filteredStudents = filteredStudents.filter(student => 
      student.grade.toLowerCase() === grade.toLowerCase()
    );
  }
  
  // Search by name if provided
  if (search) {
    filteredStudents = filteredStudents.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedStudents,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(filteredStudents.length / limit),
      total: filteredStudents.length
    }
  });
});

/**
 * @route GET /api/v1/students/:id
 * @desc Get student by ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  // Get student's assessments
  const studentAssessments = assessments.filter(a => a.studentId === student.id);
  
  res.json({
    success: true,
    data: {
      ...student,
      assessments: studentAssessments
    }
  });
});

/**
 * @route POST /api/v1/students
 * @desc Create new student
 * @access Public
 */
router.post('/', (req, res) => {
  // Validate request body
  const { error, value } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message
    });
  }
  
  const newStudent = {
    id: uuidv4(),
    ...value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  students.push(newStudent);
  
  res.status(201).json({
    success: true,
    data: newStudent,
    message: 'Student created successfully'
  });
});

/**
 * @route PUT /api/v1/students/:id
 * @desc Update student by ID
 * @access Public
 */
router.put('/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === req.params.id);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  // Validate request body
  const { error, value } = updateStudentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.details[0].message
    });
  }
  
  students[studentIndex] = {
    ...students[studentIndex],
    ...value,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: students[studentIndex],
    message: 'Student updated successfully'
  });
});

/**
 * @route DELETE /api/v1/students/:id
 * @desc Delete student by ID
 * @access Public
 */
router.delete('/:id', (req, res) => {
  const studentIndex = students.findIndex(s => s.id === req.params.id);
  
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  // Remove student and their assessments
  students.splice(studentIndex, 1);
  assessments = assessments.filter(a => a.studentId !== req.params.id);
  
  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});

/**
 * @route GET /api/v1/students/:id/assessments
 * @desc Get all assessments for a student
 * @access Public
 */
router.get('/:id/assessments', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  const studentAssessments = assessments.filter(a => a.studentId === req.params.id);
  
  res.json({
    success: true,
    data: studentAssessments
  });
});

/**
 * @route POST /api/v1/students/:id/assessments
 * @desc Save assessment result for a student
 * @access Public
 */
router.post('/:id/assessments', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      error: 'Student not found'
    });
  }
  
  const newAssessment = {
    id: uuidv4(),
    studentId: req.params.id,
    type: req.body.type || 'game-based', // game-based or advanced
    data: req.body.data,
    results: req.body.results,
    createdAt: new Date().toISOString()
  };
  
  assessments.push(newAssessment);
  
  res.status(201).json({
    success: true,
    data: newAssessment,
    message: 'Assessment saved successfully'
  });
});

/**
 * @route GET /api/v1/students/stats/overview
 * @desc Get overview statistics
 * @access Public
 */
router.get('/stats/overview', (req, res) => {
  const totalStudents = students.length;
  const totalAssessments = assessments.length;
  
  // Grade distribution
  const gradeDistribution = students.reduce((acc, student) => {
    acc[student.grade] = (acc[student.grade] || 0) + 1;
    return acc;
  }, {});
  
  // Age distribution
  const ageDistribution = students.reduce((acc, student) => {
    const ageGroup = student.age <= 5 ? '3-5' : 
                    student.age <= 8 ? '6-8' : 
                    student.age <= 12 ? '9-12' : '13-18';
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});
  
  res.json({
    success: true,
    data: {
      totalStudents,
      totalAssessments,
      gradeDistribution,
      ageDistribution,
      averageAge: students.length > 0 ? 
        (students.reduce((sum, s) => sum + s.age, 0) / students.length).toFixed(1) : 0
    }
  });
});

module.exports = router;
