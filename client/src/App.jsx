// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import ProtectedRoute from '../utils/protectedRoute.jsx'
import CreateJobForm from "./components/CreateJobForm.jsx"
import Applications from './components/Applications.jsx'
import Layout from "./Layout.jsx"
import ProfileSection from "./components/ProfileSection.jsx"
import Profile from "./components/Profile.jsx"
import UpdateProfile from "./components/UpdateProfile.jsx"

function App() {

  return (
    <div className="App bg-black/50 h-screen w-full">
      <Toaster position="top-center" duration={1000} richColors closeButton />

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />

          {/* Everything inside here gets the sidebar automatically */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/createjob" element={<CreateJobForm />} />
              <Route path="/alljobs" element={<Applications />} />
              <Route path="profile" element={<ProfileSection />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/update" element={<UpdateProfile />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App