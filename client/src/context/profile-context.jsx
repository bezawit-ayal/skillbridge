import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { apiRequest } from "../services/api"

const ProfileContext = createContext(null)

const emptyProfile = {
    name: "",
    email: "",
    location: "",
    headline: "",
    bio: "",
    experience: "",
    education: "",
    github: "",
    linkedin: "",
    portfolio: "",
    avatarUrl: "",
    skills: []
}

export function ProfileProvider({ children }) {
    const { token, user } = useAuth()
    const [profile, setProfile] = useState(() => {
        return { ...emptyProfile, name: user?.name || "", email: user?.email || "" }
    })
    const [loading, setLoading] = useState(Boolean(token))
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true
        if (!token) {
            setProfile({ ...emptyProfile, name: user?.name || "", email: user?.email || "" })
            setLoading(false)
            return () => { active = false }
        }

        setLoading(true)
        apiRequest("user-data/profile")
            .then(({ profile: storedProfile }) => {
                if (active) {
                    setProfile({
                        ...emptyProfile,
                        ...storedProfile,
                        name: storedProfile?.name || user?.name || "",
                        email: storedProfile?.email || user?.email || ""
                    })
                }
            })
            .catch((requestError) => {
                if (active) setError(requestError.message || "Could not load profile")
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [token, user])

    async function saveProfile(nextProfile) {
        try {
            setError("")
            const data = await apiRequest("user-data/profile", {
                method: "PUT",
                body: JSON.stringify(nextProfile)
            })
            setProfile({ ...emptyProfile, ...data.profile })
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not save profile")
            return false
        }
    }

    return (
        <ProfileContext.Provider
            value={{
                profile,
                setProfile,
                saveProfile,
                loading,
                error
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