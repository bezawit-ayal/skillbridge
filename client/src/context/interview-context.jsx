import { createContext, useContext, useState } from "react"

const InterviewContext = createContext(null)

const initialInterviews = [
    {
        id: 1,
        applicationId: 2,
        type: "Technical Interview",
        date: "2026-10-05",
        time: "10:00",
        duration: 60,
        meetingUrl: "",
        notes: "Prepare React and JavaScript questions.",
        status: "Upcoming"
    }
]

export function InterviewProvider({ children }) {

    const [interviews, setInterviews] = useState(initialInterviews)

    function addInterview(interview) {
        setInterviews((currentInterviews) => [
            ...currentInterviews,
            interview
        ])
    }

    function updateInterview(interview) {
        setInterviews((currentInterviews) =>
            currentInterviews.map((currentInterview) =>
                currentInterview.id === interview.id
                    ? interview
                    : currentInterview
            )
        )
    }

    function deleteInterview(id) {
        setInterviews((currentInterviews) =>
            currentInterviews.filter(
                (interview) => interview.id !== id
            )
        )
    }

    return (
        <InterviewContext.Provider
            value={{
                interviews,
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