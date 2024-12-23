import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import PostDetailsPage from './pages/PostDetailsPage'
import NotificationPage from './pages/NotificationPage'
import HomePage from './pages/HomePage'
import BookmarksPage from './pages/BookmarksPage'
import FollowersPage from './pages/FollowersPage'
import FolloweePage from './pages/FolloweePage'
import ProfilePage from './pages/ProfilePage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import SettingsPage from './pages/SettingsPage'
import DowntimePage from './pages/DowntimePage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/down" element={<DowntimePage />} />
        <Route path="/verify-email/:emailToken" element={<EmailVerificationPage />} />

        {/* Private Routes */}
        <Route path='/' element={<PrivateRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* <Route path="/explore" element={<h1>Explore</h1>} /> */}
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/:username/followers" element={<FollowersPage />} />
          <Route path="/:username/following" element={<FolloweePage />} />
          <Route path="/:username/post/:postId" element={<PostDetailsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </>
  )
}

export default App

// Private:::
// Home Page
// Notification Page
// Bookmarks Page
// PostDetails Page
// Settings Page
