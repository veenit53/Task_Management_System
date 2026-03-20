import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/signup`,
        {
          fullname: {
            firstname: formData.firstName,
            lastname: formData.lastName
          },
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        },
        {
          withCredentials: true // 🔥 IMPORTANT
        }
      )

      const data = response.data

      if (data.success) {
        // store token
        localStorage.setItem('token', data.token)

        // store user
        setUser(data.user)

        // redirect
        navigate('/dashboard')
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={submitHandler}>

          {/* Name */}
          <div className="flex gap-4 mb-4">
            <input
              required
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              className="w-1/2 px-4 py-2 border rounded-lg"
            />
            <input
              required
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              className="w-1/2 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Username */}
          <input
            required
            name="username"
            value={formData.username}
            onChange={handleChange}
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {/* Email */}
          <input
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="email@example.com"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          {/* Password */}
          <input
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
            className="w-full mb-6 px-4 py-2 border rounded-lg"
          />

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default UserSignup