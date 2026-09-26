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
import Analytics from "./pages/analytics"
import Profile from "./pages/profile"
import Settings from "./pages/settings"

function App() {
    return (
        <BrowserRouter>
            <ApplicationProvider>
                <InterviewProvider>
                    <Routes>

                        <Route element={<Layout />}>

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
        </BrowserRouter>
    )
}

export default App