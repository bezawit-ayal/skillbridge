import { createContext, useContext, useState } from "react"

const ApplicationContext = createContext(null)

const initialApplications = [
    {
        id: 1,
        company: "Tech Solutions",
        position: "Frontend Developer",
        location: "Addis Ababa",
        salary: "",
        jobType: "Full-time",
        status: "Applied",
        appliedDate: "",
        jobUrl: "",
        notes: ""
    },
    {
        id: 2,
        company: "Digital Ethiopia",
        position: "React Developer",
        location: "Remote",
        salary: "",
        jobType: "Remote",
        status: "Interview",
        appliedDate: "",
        jobUrl: "",
        notes: ""
    },
    {
        id: 3,
        company: "Web Systems",
        position: "Junior Developer",
        location: "Addis Ababa",
        salary: "",
        jobType: "Full-time",
        status: "Applied",
        appliedDate: "",
        jobUrl: "",
        notes: ""
    },
    {
        id: 4,
        company: "Software Hub",
        position: "Frontend Developer",
        location: "Remote",
        salary: "",
        jobType: "Remote",
        status: "Offer",
        appliedDate: "",
        jobUrl: "",
        notes: ""
    }
]

export function ApplicationProvider({ children }) {

    const [applications, setApplications] = useState(
        initialApplications
    )

    function addApplication(application) {

        setApplications((currentApplications) => [
            ...currentApplications,
            application
        ])
    }

    function updateApplication(application) {

        setApplications((currentApplications) =>
            currentApplications.map((currentApplication) =>
                currentApplication.id === application.id
                    ? application
                    : currentApplication
            )
        )
    }

    function deleteApplication(id) {

        setApplications((currentApplications) =>
            currentApplications.filter(
                (application) => application.id !== id
            )
        )
    }

    return (
        <ApplicationContext.Provider
            value={{
                applications,
                setApplications,
                addApplication,
                updateApplication,
                deleteApplication
            }}
        >
            {children}
        </ApplicationContext.Provider>
    )
}

export function useApplications() {

    const context = useContext(ApplicationContext)

    if (!context) {
        throw new Error(
            "useApplications must be used inside ApplicationProvider"
        )
    }

    return context
}