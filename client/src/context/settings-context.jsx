import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { apiRequest } from "../services/api"

const SettingsContext = createContext(null)

export const defaultSettings = {
    emailNotifications: true,
    interviewReminders: true,
    jobAlerts: true,
    profileVisibility: true
}

export function SettingsProvider({ children }) {
    const { token } = useAuth()
    const [settings, setSettings] = useState(defaultSettings)
    const [error, setError] = useState("")

    useEffect(() => {
        let active = true
        setError("")
        if (!token) {
            setSettings(defaultSettings)
            return () => { active = false }
        }

        apiRequest("user-data/settings")
            .then(({ settings: storedSettings }) => {
                if (active && storedSettings) {
                    setSettings({ ...defaultSettings, ...storedSettings })
                }
            })
            .catch((requestError) => {
                if (active) setError(requestError.message || "Could not load settings")
            })

        return () => { active = false }
    }, [token])

    async function saveSettings(nextSettings) {
        try {
            setError("")
            const data = await apiRequest("user-data/settings", {
                method: "PUT",
                body: JSON.stringify(nextSettings)
            })
            setSettings({ ...defaultSettings, ...data.settings })
            return true
        } catch (requestError) {
            setError(requestError.message || "Could not save settings")
            return false
        }
    }

    async function resetSettings() {
        return saveSettings(defaultSettings)
    }

    return (
        <SettingsContext.Provider
            value={{ settings, saveSettings, resetSettings, error }}
        >
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error("useSettings must be used inside SettingsProvider")
    }
    return context
}