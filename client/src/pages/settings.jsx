import { useEffect, useState } from "react"
import { defaultSettings, useSettings } from "../context/settings-context"
import {
    Settings as SettingsIcon,
    Bell,
    Mail,
    CalendarClock,
    Briefcase,
    Lock,
    Save,
    RotateCcw
} from "lucide-react"

function Settings() {
    const { settings: savedSettings, saveSettings, resetSettings, error } = useSettings()
    const [settings, setSettings] = useState(savedSettings)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setSettings(savedSettings)
    }, [savedSettings])

    function handleToggle(name) {
        setSettings((currentSettings) => ({
            ...currentSettings,
            [name]: !currentSettings[name]
        }))

        setSaved(false)
    }

    async function handleSave() {
        setSaved(await saveSettings(settings))
    }

    async function handleReset() {
        const wasSaved = await resetSettings()
        if (wasSaved) {
            setSettings(defaultSettings)
            setSaved(true)
        }
    }

    return (
        <div className="settings-page">

            <section className="settings-intro">
                <div className="settings-title-row">

                    <div className="settings-page-icon">
                        <SettingsIcon size={20} />
                    </div>

                    <div>
                        <h1>Settings</h1>
                        <p>
                            Manage your SkillBridge preferences.
                        </p>
                    </div>

                </div>
            </section>

            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Notifications</h2>
                        <p>
                            Choose how SkillBridge keeps you updated.
                        </p>
                    </div>
                </div>

                <div className="settings-list">

                    <div className="settings-row">

                        <div className="settings-row-icon">
                            <Mail size={18} />
                        </div>

                        <div className="settings-row-content">
                            <h3>Email Notifications</h3>
                            <p>
                                Receive important updates and account notifications.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={`settings-switch ${settings.emailNotifications
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleToggle("emailNotifications")
                            }
                            aria-label="Toggle email notifications"
                            aria-pressed={settings.emailNotifications}
                        >
                            <span />
                        </button>

                    </div>

                    <div className="settings-row">

                        <div className="settings-row-icon">
                            <CalendarClock size={18} />
                        </div>

                        <div className="settings-row-content">
                            <h3>Interview Reminders</h3>
                            <p>
                                Get reminders about upcoming interviews.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={`settings-switch ${settings.interviewReminders
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleToggle("interviewReminders")
                            }
                            aria-label="Toggle interview reminders"
                            aria-pressed={settings.interviewReminders}
                        >
                            <span />
                        </button>

                    </div>

                    <div className="settings-row">

                        <div className="settings-row-icon">
                            <Briefcase size={18} />
                        </div>

                        <div className="settings-row-content">
                            <h3>Job Alerts</h3>
                            <p>
                                Receive notifications about relevant job opportunities.
                            </p>
                        </div>

                        <button
                            type="button"
                            className={`settings-switch ${settings.jobAlerts
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleToggle("jobAlerts")
                            }
                            aria-label="Toggle job alerts"
                            aria-pressed={settings.jobAlerts}
                        >
                            <span />
                        </button>

                    </div>

                </div>

            </section>

            <section className="settings-card">

                <div className="settings-section-header">
                    <div>
                        <h2>Privacy</h2>
                        <p>
                            Control how your professional profile is displayed.
                        </p>
                    </div>
                </div>

                <div className="settings-row">

                    <div className="settings-row-icon">
                        <Lock size={18} />
                    </div>

                    <div className="settings-row-content">
                        <h3>Profile Visibility</h3>
                        <p>
                            Save whether your professional profile should be
                            visible to employers.
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`settings-switch ${settings.profileVisibility
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            handleToggle("profileVisibility")
                        }
                        aria-label="Toggle profile visibility"
                        aria-pressed={settings.profileVisibility}
                    >
                        <span />
                    </button>

                </div>

            </section>

            <div className="settings-actions">

                <button
                    type="button"
                    className="settings-reset-button"
                    onClick={handleReset}
                >
                    <RotateCcw size={15} />
                    Reset
                </button>

                <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                >
                    <Save size={15} />

                    {saved ? "Saved" : "Save Changes"}
                </button>

            </div>

            {error && <div className="app-error" role="alert">{error}</div>}

        </div>
    )
}

export default Settings