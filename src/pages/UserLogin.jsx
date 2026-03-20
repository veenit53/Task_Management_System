import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext.jsx'

const UserLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true
        }
      )

      const data = response.data

      if (data.success) {

        // store token
        localStorage.setItem('token', data.token)

        // store user
        setUser(data.user)

        // redirect
        navigate('/')
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to Your Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={submitHandler}>

          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="w-full mb-6 px-4 py-2 border rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          New here?{' '}
          <Link to="/signup" className="text-blue-600 font-medium">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default UserLogin