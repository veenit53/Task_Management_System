import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx';
import UserSignup from './pages/UserSignup.jsx';
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx';


const App = () =>{
    return(
        <div>
            <Routes>
                <Route path="/login" element = {<UserLogin />} />
                <Route path="/signup" element = {<UserSignup />} />

                <Route path="/home" element={
                    <UserProtectedWrapper>
                        <Home />
                    </UserProtectedWrapper>
                } />
            </Routes>
        </div>
    )
}

export default App;

