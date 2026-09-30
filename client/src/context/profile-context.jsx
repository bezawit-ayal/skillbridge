import { createContext, useContext, useState } from "react"

const ProfileContext = createContext(null)

const initialProfile = {
    name: "Bezawit Ayal",
    email: "bezawit@example.com",
    location: "Bahir Dar, Ethiopia",
    headline: "Full Stack Developer",
    bio: "Passionate developer focused on building modern and practical web applications.",
    experience: "3+ years",
    education: "Computer Science",
    github: "",
    linkedin: "",
    portfolio: "",
    avatarUrl: "",
    skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "PHP",
        "MySQL"
    ]
}

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(initialProfile)

    return (
        <ProfileContext.Provider
            value={{
                profile,
                setProfile
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)

    if (!context) {
        throw new Error(
            "useProfile must be used inside ProfileProvider"
        )
    }

    return context
}