import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import { ApplicationProvider } from "./context/application-context"
import { InterviewProvider } from "./context/interview-context"

import Layout from "./components/layout/layout"

import Dashboard from "./pages/dashboard"
import Jobs from "./pages/jobs"
import Applications from "./pages/applications"
import ApplicationDetails from "./pages/application-details"
import Interviews from "./pages/interviews"
import CareerTools from "./pages/career-tools"
import ResumeBuilder from "./pages/resume-builder"
import InterviewPrep from "./pages/interview-prep"
import ManageSkills from "./pages/manage-skills"
import PortfolioBuilder from "./pages/portfolio-builder"
import Analytics from "./pages/analytics"
import Profile from "./pages/profile"
import { ProfileProvider } from "./context/profile-context"
import { SettingsProvider } from "./context/settings-context"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Settings from "./pages/settings"
import Login from "./pages/login"
import Register from "./pages/register"
import { useLocation } from "react-router-dom"

function RequireAuth({ children }) {
    const { token } = useAuth()
    const location = useLocation()

    return token
        ? children
        : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SettingsProvider>
                    <ProfileProvider>
                        <ApplicationProvider>
                            <InterviewProvider>
                            <Routes>

                                <Route
                                    path="/login"
                                    element={<Login />}
                                />

                                <Route
                                    path="/register"
                                    element={<Register />}
                                />

                                <Route element={<RequireAuth><Layout /></RequireAuth>}>

                                    <Route
                                        path="/"
                                        element={
                                            <Navigate
                                                to="/dashboard"
                                                replace
                                            />
                                        }
                                    />

                                    <Route
                                        path="/dashboard"
                                        element={<Dashboard />}
                                    />

                                    <Route
                                        path="/jobs"
                                        element={<Jobs />}
                                    />

                                    <Route
                                        path="/applications"
                                        element={<Applications />}
                                    />

                                    <Route
                                        path="/applications/:id"
                                        element={<ApplicationDetails />}
                                    />

                                    <Route
                                        path="/interviews"
                                        element={<Interviews />}
                                    />

                                    <Route
                                        path="/career-tools"
                                        element={<CareerTools />}
                                    />
                                    <Route
                                        path="/career-tools/resume"
                                        element={<ResumeBuilder />}
                                    />
                                    <Route
                                        path="/career-tools/interview-prep"
                                        element={<InterviewPrep />}
                                    />
                                    <Route
                                        path="/career-tools/manage-skills"
                                        element={<ManageSkills />}
                                    />
                                    <Route
                                        path="/career-tools/portfolio"
                                        element={<PortfolioBuilder />}
                                    />
                                    <Route
                                        path="/analytics"
                                        element={<Analytics />}
                                    />

                                    <Route
                                        path="/profile"
                                        element={<Profile />}
                                    />

                                    <Route
                                        path="/settings"
                                        element={<Settings />}
                                    />
                                    <Route
                                        path="*"
                                        element={
                                            <Navigate
                                                to="/dashboard"
                                                replace
                                            />
                                        }
                                    />

                                </Route>

                            </Routes>
                            </InterviewProvider>
                        </ApplicationProvider>
                    </ProfileProvider>
                </SettingsProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App