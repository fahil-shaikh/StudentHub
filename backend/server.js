require('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

// Home route
app.get('/', (req, res) => {
  res.send('StudentHub Backend is running!')
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'StudentHub API is working successfully',
    status: 'OK',
  })
})

// Get all students
app.get('/api/students', (req, res) => {
  const sql = 'SELECT * FROM students ORDER BY id DESC'

  db.query(sql, (error, results) => {
    if (error) {
      console.error(error.message)
      return res.status(500).json({
        message: 'Failed to fetch students',
      })
    }

    res.json(results)
  })
})
// Add a new student
app.post('/api/students', (req, res) => {
  const { student_id, name, email, course, status } = req.body

  // Validate required fields
  if (!student_id || !name) {
    return res.status(400).json({
      message: 'Student ID and name are required',
    })
  }

  const sql = `
    INSERT INTO students (student_id, name, email, course, status)
    VALUES (?, ?, ?, ?, ?)
  `

  const values = [
    student_id,
    name,
    email || null,
    course || null,
    status || 'Active',
  ]

  db.query(sql, values, (error, result) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Student ID already exists',
        })
      }

      console.error(error.message)

      return res.status(500).json({
        message: 'Failed to add student',
      })
    }

    res.status(201).json({
      message: 'Student added successfully',
      id: result.insertId,
    })
  })
})
// Update an existing student
app.put('/api/students/:studentId', (req, res) => {
  const { name, email, course, status } = req.body
  const studentId = req.params.studentId

  if (!name || !email || !course || !status) {
    return res.status(400).json({
      message: 'All student details are required',
    })
  }

  const sql = `
    UPDATE students
    SET name = ?, email = ?, course = ?, status = ?
    WHERE student_id = ?
  `

  const values = [name, email, course, status, studentId]

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error(error.message)

      return res.status(500).json({
        message: 'Failed to update student',
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Student not found',
      })
    }

    res.json({
      message: 'Student updated successfully',
    })
  })
})
// Delete a student
app.delete('/api/students/:studentId', (req, res) => {
  const studentId = req.params.studentId

  const sql = 'DELETE FROM students WHERE student_id = ?'

  db.query(sql, [studentId], (error, result) => {
    if (error) {
      console.error(error.message)

      return res.status(500).json({
        message: 'Failed to delete student',
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Student not found',
      })
    }

    res.json({
      message: 'Student deleted successfully',
    })
  })
})
// Start server

app.listen(PORT, () => {
  console.log(`StudentHub server running at http://localhost:${PORT}`)
})