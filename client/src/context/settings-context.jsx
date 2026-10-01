import { createContext, useContext, useState } from "react"

const SettingsContext = createContext(null)

export const defaultSettings = {
    emailNotifications: true,
    interviewReminders: true,
    jobAlerts: true,
    profileVisibility: true
}

const storageKey = "skillbridge-settings"

function loadSettings() {
    try {
        const stored = localStorage.getItem(storageKey)
        return stored
            ? { ...defaultSettings, ...JSON.parse(stored) }
            : defaultSettings
    } catch {
        return defaultSettings
    }
}

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(loadSettings)

    function saveSettings(nextSettings) {
        localStorage.setItem(storageKey, JSON.stringify(nextSettings))
        setSettings(nextSettings)
    }

    function resetSettings() {
        saveSettings(defaultSettings)
    }

    return (
        <SettingsContext.Provider
            value={{ settings, saveSettings, resetSettings }}
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