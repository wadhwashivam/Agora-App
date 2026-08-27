import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import EditProfile from "./pages/EditProfile";
import FeedPage from "./pages/FeedPage";
import UserProfile from "./pages/UserProfile";
import UserIndexPage from "./pages/UserIndexPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PostPage from "./pages/PostPage";

function App() {

  return (
    <Routes>
      <Route path='/' element= {<ProtectedRoute><Navigate to= "/feed" replace/></ProtectedRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/feed' element = {<ProtectedRoute><FeedPage /></ProtectedRoute>} />
      <Route path= '/users' element = {<ProtectedRoute><UserIndexPage /></ProtectedRoute>} />
      <Route path='/users/:id' element = {<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path='/profile/edit' element= {<ProtectedRoute><EditProfile /></ProtectedRoute>}  />
      <Route path='/posts/:postId' element = {<ProtectedRoute><PostPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
