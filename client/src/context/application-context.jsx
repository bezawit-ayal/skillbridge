import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { apiRequest } from "../services/api"

const ApplicationContext = createContext(null)

function normalizeApplication(application) {
    return {
        ...application,
        jobType: application.job_type || application.jobType || "",
        appliedDate: application.applied_date || application.appliedDate || "",
        jobUrl: application.job_url || application.jobUrl || ""
    }
}

function serializeApplication(application) {
    return JSON.stringify({
        company: application.company,
        position: application.position,
        status: application.status,
        location: application.location,
        salary: application.salary,
        job_type: application.jobType,
        job_url: application.jobUrl,
        notes: application.notes,
        applied_date: application.appliedDate
    })
}

export function ApplicationProvider({ children }) {
    const { token } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    async function refreshApplications() {
        if (!token) {
            setApplications([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError("")
            const data = await apiRequest("applications")
            setApplications((data.applications || []).map(normalizeApplication))
        } catch (requestError) {
            setError(requestError.message || "Could not load applications")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshApplications()
    }, [token])

    async function addApplication(application) {
        try {
            setError("")
            const data = await apiRequest("applications", {
                method: "POST",
                body: serializeApplication(application)
            })
            const savedApplication = normalizeApplication(data.application)
            setApplications((current) => [savedApplication, ...current])
            return savedApplication
        } catch (requestError) {
            setError(requestError.message || "Could not save application")
            return null
        }
    }

    async function updateApplication(application) {
        try {
            setError("")
            await apiRequest(`applications/${application.id}`, {
                method: "PUT",
                body: serializeApplication(application)
            })
            setApplications((current) => current.map((item) =>
                item.id === application.id ? application : item
            ))
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not update application")
            return false
        }
    }

    async function deleteApplication(id) {
        try {
            setError("")
            await apiRequest(`applications/${id}`, { method: "DELETE" })
            setApplications((current) => current.filter((item) => item.id !== id))
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not delete application")
            return false
        }
    }

    return (
        <ApplicationContext.Provider
            value={{
                applications,
                loading,
                error,
                refreshApplications,
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