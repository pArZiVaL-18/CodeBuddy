// routes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard.jsx";
import SolveSolo from "./pages/SolveSolo";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUp";
import Leaderboard from "./pages/LeaderBoard";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/solve/:problemId" element={<SolveSolo />} />
                <Route path="/room/:roomId" element={<RoomPage />} />
            </Routes>
        </BrowserRouter>
    );
}
