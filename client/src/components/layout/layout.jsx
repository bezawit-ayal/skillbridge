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
        updateApplication
    } = useApplications()


    function handleSaveApplication(application) {

        console.log("LAYOUT RECEIVED:", application)

        if (editingApplication) {

            console.log("UPDATING APPLICATION")

            updateApplication(application)

        } else {

            console.log("ADDING APPLICATION")

            addApplication(application)
        }

        // Close modal
        setShowApplicationForm(false)

        // Clear editing state
        setEditingApplication(null)
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

                />

            )}

        </div>
    )
}

export default Layout