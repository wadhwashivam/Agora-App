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
import ProtectedLayout from "./components/ProtectedLayout";

function App() {

  return (
    <Routes>
      <Route path='/' element= {<ProtectedRoute><Navigate to= "/feed" replace/></ProtectedRoute>} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route path='/feed' element = {<FeedPage />} />
        <Route path= '/users' element = {<UserIndexPage />} />
        <Route path='/users/:id' element = {<UserProfile />} />
        <Route path='/profile/edit' element= {<EditProfile />}  />
        <Route path='/posts/:postId' element = {<PostPage />} />
      </Route>      
    </Routes>
  )
}

export default App
