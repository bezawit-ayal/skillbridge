import {
    LayoutDashboard,
    Briefcase,
    ClipboardList,
    CalendarDays,
    Wrench,
    BarChart3,
    User,
    Settings,
    X
} from "lucide-react"

import { NavLink } from "react-router-dom"

function Sidebar({ isOpen, onClose }) {

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Jobs",
            path: "/jobs",
            icon: Briefcase
        },
        {
            name: "Applications",
            path: "/applications",
            icon: ClipboardList
        },
        {
            name: "Interviews",
            path: "/interviews",
            icon: CalendarDays
        },
        {
            name: "Career Tools",
            path: "/career-tools",
            icon: Wrench
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: BarChart3
        },
        {
            name: "Profile",
            path: "/profile",
            icon: User
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings
        }
    ]

    return (
        <>
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`sidebar ${isOpen ? "sidebar-open" : ""
                    }`}
            >

                <div className="sidebar-header">

                    <div className="brand">

                        <div className="brand-icon">
                            S
                        </div>

                        <div className="brand-text">
                            <h2>SkillBridge</h2>
                            <span>Career Platform</span>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="sidebar-close"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>

                </div>

                <nav className="sidebar-navigation">

                    <p className="navigation-title">
                        MENU
                    </p>

                    {navigation.map((item) => {

                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `navigation-link ${isActive
                                        ? "active"
                                        : ""
                                    }`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </NavLink>
                        )
                    })}

                </nav>

                <div className="sidebar-footer">

                    <div className="help-card">

                        <div className="help-icon">
                            ?
                        </div>

                        <div>
                            <strong>Need help?</strong>
                            <p>
                                We're here to support your career.
                            </p>
                        </div>

                    </div>

                </div>

            </aside>
        </>
    )
}

export default Sidebar