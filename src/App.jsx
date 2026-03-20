import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import CreateTask from './pages/CreateTask.jsx'
import TaskDetails from './pages/TaskDetail.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/' element={<Home />} />
        <Route path='/create-task' element={<CreateTask />} />
        <Route path='/task/:id' element={<TaskDetails />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
