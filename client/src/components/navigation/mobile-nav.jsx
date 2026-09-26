import {
    LayoutDashboard,
    Briefcase,
    ClipboardList,
    CalendarDays,
    User
} from "lucide-react"

import { NavLink } from "react-router-dom"

function MobileNav() {

    const navigation = [
        {
            name: "Home",
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
            name: "Profile",
            path: "/profile",
            icon: User
        }
    ]

    return (
        <nav className="mobile-navigation">

            {navigation.map((item) => {

                const Icon = item.icon

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `mobile-navigation-link ${isActive
                                ? "active"
                                : ""
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                )
            })}

        </nav>
    )
}

export default MobileNav