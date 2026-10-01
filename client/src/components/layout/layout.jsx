import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "./sidebar"
import Header from "./header"
import MobileNav from "../navigation/mobile-nav"
import AddApplication from "../applications/add-application"

import { useApplications } from "../../context/application-context"

function Layout() {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    const [showApplicationForm, setShowApplicationForm] =
        useState(false)

    const [editingApplication, setEditingApplication] =
        useState(null)

    // Get application functions from Context
    const {
        addApplication,
        updateApplication,
        error: applicationError
    } = useApplications()

    async function handleSaveApplication(application) {
        const saved = editingApplication
            ? await updateApplication(application)
            : await addApplication(application)

        if (!saved) {
            return false
        }

        setShowApplicationForm(false)
        setEditingApplication(null)
        return true
    }


    function handleNewApplication() {

        setEditingApplication(null)

        setShowApplicationForm(true)
    }


    function handleCloseApplicationForm() {

        setShowApplicationForm(false)

        setEditingApplication(null)
    }


    return (
        <div className="app-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />


            <div className="main-area">

                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    onNewApplication={handleNewApplication}
                />


                <main className="page-content">

                    {applicationError && (
                        <div className="app-error" role="alert">
                            {applicationError}
                        </div>
                    )}

                    <Outlet
                        context={{
                            setEditingApplication,
                            setShowApplicationForm
                        }}
                    />

                </main>

            </div>


            <MobileNav />


            {showApplicationForm && (

                <AddApplication

                    onClose={handleCloseApplicationForm}

                    onAdd={handleSaveApplication}

                    initialApplication={editingApplication}

                    error={applicationError}

                />

            )}

        </div>
    )
}

export default Layout