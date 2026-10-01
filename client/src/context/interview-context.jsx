import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { apiRequest } from "../services/api"

const InterviewContext = createContext(null)

function normalizeInterview(interview) {
    const formatDate = (value) => value instanceof Date
        ? value.toISOString().slice(0, 10)
        : String(value || "").slice(0, 10)
    const formatTime = (value) => String(value || "").slice(0, 5)

    return {
        ...interview,
        applicationId: interview.application_id ?? interview.applicationId ?? "",
        meetingUrl: interview.meeting_url ?? interview.meetingUrl ?? "",
        date: formatDate(interview.date),
        time: formatTime(interview.time)
    }
}

function serializeInterview(interview) {
    return JSON.stringify({
        application_id: interview.applicationId || null,
        type: interview.type,
        date: interview.date,
        time: interview.time,
        duration: Number(interview.duration) || 60,
        meeting_url: interview.meetingUrl,
        notes: interview.notes,
        status: interview.status
    })
}

export function InterviewProvider({ children }) {
    const { token } = useAuth()
    const [interviews, setInterviews] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true
        setError("")
        if (!token) {
            setInterviews([])
            return () => { active = false }
        }

        apiRequest("user-data/interviews")
            .then(({ interviews: savedInterviews }) => {
                if (active) setInterviews((savedInterviews || []).map(normalizeInterview))
            })
            .catch((requestError) => {
                if (active) setError(requestError.message || "Could not load interviews")
            })

        return () => { active = false }
    }, [token])

    async function addInterview(interview) {
        try {
            setError("")
            const data = await apiRequest("user-data/interviews", {
                method: "POST",
                body: serializeInterview(interview)
            })
            const savedInterview = normalizeInterview(data.interview)
            setInterviews((current) => [...current, savedInterview])
            return savedInterview
        } catch (requestError) {
            setError(requestError.message || "Could not save interview")
            return null
        }
    }

    async function updateInterview(interview) {
        try {
            setError("")
            await apiRequest(`user-data/interviews/${interview.id}`, {
                method: "PUT",
                body: serializeInterview(interview)
            })
            setInterviews((current) => current.map((item) =>
                item.id === interview.id ? interview : item
            ))
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not update interview")
            return false
        }
    }

    async function deleteInterview(id) {
        try {
            setError("")
            await apiRequest(`user-data/interviews/${id}`, { method: "DELETE" })
            setInterviews((current) => current.filter((item) => item.id !== id))
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not delete interview")
            return false
        }
    }

    return (
        <InterviewContext.Provider
            value={{
                interviews,
                error,
                addInterview,
                updateInterview,
                deleteInterview
            }}
        >
            {children}
        </InterviewContext.Provider>
    )
}

export function useInterviews() {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error(
            "useInterviews must be used inside InterviewProvider"
        )
    }

    return context
}