
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  Search,
  Pencil,
  Trash2,
} from 'lucide-react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [students, setStudents] = useState([])
// Fetch students from MySQL database
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students')

      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }

      const data = await response.json()

      // Convert database records into frontend format
      const formattedStudents = data.map((student) => ({
        id: student.student_id,
        name: student.name,
        email: student.email || '',
        course: student.course || '',
        status: student.status,
      }))

      setStudents(formattedStudents)
    } catch (error) {
      console.error('Error fetching students:', error.message)
    }
  }

  fetchStudents()
}, [])
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  id: '',
  course: '',
  status: 'Active',
})

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Add or update student
 // Fetch students from MySQL database
// Add or update student
const handleSubmit = async (e) => {
  e.preventDefault()

  // Edit existing student in MySQL
if (editingId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${editingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          course: formData.course,
          status: formData.status,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      alert(result.message)
      return
    }

    const updatedResponse = await fetch(
      'http://localhost:5000/api/students'
    )

    const data = await updatedResponse.json()

    setStudents(data.map((student) => ({
      id: student.student_id,
      name: student.name,
      email: student.email || '',
      course: student.course || '',
      status: student.status,
    })))

    alert('Student updated successfully!')
    resetForm()

  } catch (error) {
    console.error('Error updating student:', error)
    alert('Unable to update student!')
  }

  return
}

  // Add new student to MySQL
  try {
    const response = await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: formData.id,
        name: formData.name,
        email: formData.email,
        course: formData.course,
        status: formData.status,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      alert(result.message)
      return
    }

    // Refresh students from database
    const updatedResponse = await fetch(
      'http://localhost:5000/api/students'
    )

    const data = await updatedResponse.json()

    setStudents(data.map((student) => ({
      id: student.student_id,
      name: student.name,
      email: student.email || '',
      course: student.course || '',
      status: student.status,
    })))

    alert('Student added successfully!')
    resetForm()

  } catch (error) {
    console.error('Error adding student:', error)
    alert('Unable to connect to the server!')
  }
}
  // Reset form
  const resetForm = () => {
  setFormData({
    name: '',
    email: '',
    id: '',
    course: '',
    status: 'Active',
  })
  setEditingId(null)
  setShowForm(false)
}

  // Edit student
  const handleEdit = (student) => {
    setFormData({
  name: student.name,
  email: student.email,
  id: student.id,
  course: student.course,
  status: student.status,
})

    setEditingId(student.id)
    setShowForm(true)
  }

  // Delete student
  // Delete student from MySQL
const handleDelete = async (studentId) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this student?'
  )

  if (!confirmDelete) {
    return
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/students/${studentId}`,
      {
        method: 'DELETE',
      }
    )

    const result = await response.json()

    if (!response.ok) {
      alert(result.message)
      return
    }

    // Refresh student records from database
    const updatedResponse = await fetch(
      'http://localhost:5000/api/students'
    )

    const data = await updatedResponse.json()

    setStudents(data.map((student) => ({
      id: student.student_id,
      name: student.name,
      email: student.email || '',
      course: student.course || '',
      status: student.status,
    })))

    alert('Student deleted successfully!')

  } catch (error) {
    console.error('Error deleting student:', error)
    alert('Unable to delete student!')
  }
}

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">StudentHub</h2>

        <nav>
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>

          <div className="nav-item">
            <Users size={20} />
            <span>Students</span>
          </div>

          <div className="nav-item">
            <GraduationCap size={20} />
            <span>Courses</span>
          </div>

          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your students.</p>

        {/* Statistics cards */}
        <div className="stats-container">

          <div className="stat-card">
            <h3>Total Students</h3>
            <h2>{students.length}</h2>
            <p>All registered students</p>
          </div>

          <div className="stat-card">
            <h3>Active Students</h3>
            <h2>{students.filter((s) => s.status === 'Active').length}</h2>
            <p>Currently studying</p>
          </div>

          <div className="stat-card">
            <h3>Total Courses</h3>
            <h2>{new Set(students.map((s) => s.course).filter(Boolean)).size}</h2>
            <p>Available courses</p>
          </div>

          <div className="stat-card">
            <h3>Inactive Students</h3>
           <h2>{students.filter((s) => s.status === 'Inactive').length}</h2>
            <p>Recently enrolled</p>
          </div>

        </div>

        {/* Student records */}
        <section className="students-section">

          <div className="students-header">
            <div>
              <h2>Student Records</h2>
              <p>Manage and view all registered students</p>
            </div>

            <button
              className="add-student-btn"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              + Add Student
            </button>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <form className="student-form" onSubmit={handleSubmit}>
              <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>

              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                name="id"
                placeholder="Student ID"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={editingId !== null}
              />

              <input
                type="text"
                name="course"
                placeholder="Course Name"
                value={formData.course}
                onChange={handleInputChange}
                required
              />
              <select
  name="status"
  value={formData.status || 'Active'}
  onChange={handleInputChange}
>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</select>

              <div>
                <button type="submit" className="add-student-btn">
                  {editingId ? 'Update Student' : 'Save Student'}
                </button>

                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, student ID or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>
                      <span className={`status ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(student)}
                        title="Edit Student"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(student.id)}
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <p className="no-results">No students found.</p>
            )}
          </div>

        </section>
      </main>
    </div>
  )
}

export default App
