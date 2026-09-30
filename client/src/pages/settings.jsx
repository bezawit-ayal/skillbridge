import { useState } from "react"
import {
    Settings as SettingsIcon,
    Bell,
    Mail,
    CalendarClock,
    Briefcase,
    Lock,
    Palette,
    Save,
    RotateCcw
} from "lucide-react"

function Settings() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        interviewReminders: true,
        jobAlerts: true,
        profileVisibility: true,
        appearance: "Light"
    })

    const [saved, setSaved] = useState(false)

    function handleToggle(name) {
        setSettings((currentSettings) => ({
            ...currentSettings,
            [name]: !currentSettings[name]
        }))

        setSaved(false)
    }

    function handleAppearanceChange(event) {
        setSettings((currentSettings) => ({
            ...currentSettings,
            appearance: event.target.value
        }))

        setSaved(false)
    }

    function handleSave() {
        setSaved(true)

        setTimeout(() => {
            setSaved(false)
        }, 2500)
    }

    function handleReset() {
        setSettings({
            emailNotifications: true,
            interviewReminders: true,
            jobAlerts: true,
            profileVisibility: true,
            appearance: "Light"
        })

        setSaved(false)
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
                        <h2>Appearance</h2>
                        <p>
                            Customize how SkillBridge looks for you.
                        </p>
                    </div>
                </div>

                <div className="settings-preference-row">

                    <div className="settings-preference-info">

                        <div className="settings-row-icon">
                            <Palette size={18} />
                        </div>

                        <div>
                            <h3>Theme</h3>
                            <p>
                                Choose your preferred appearance.
                            </p>
                        </div>

                    </div>

                    <select
                        className="settings-select"
                        value={settings.appearance}
                        onChange={handleAppearanceChange}
                    >
                        <option value="Light">Light</option>
                        <option value="Dark">Dark</option>
                    </select>

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
                            Allow your professional profile to be visible to
                            employers.
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

        </div>
    )
}

export default Settings