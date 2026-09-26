import { Menu, Bell, Plus } from "lucide-react"

function Header({ onMenuClick, onNewApplication }) {
    return (
        <header className="header">

            <div className="header-left">

                <button
                    type="button"
                    className="menu-button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <Menu size={22} />
                </button>

                <div className="page-heading">
                    <span>Welcome back</span>
                    <h1>Good morning, Bezawit</h1>
                </div>

            </div>


            <div className="header-actions">

                <button
                    type="button"
                    className="add-button"
                    onClick={onNewApplication}
                >
                    <Plus size={18} />
                    <span>New Application</span>
                </button>


                <button
                    type="button"
                    className="icon-button"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>


                <button
                    type="button"
                    className="profile-button"
                >
                    <div className="profile-avatar">
                        B
                    </div>

                    <div className="profile-info">
                        <strong>Bezawit Ayal</strong>
                        <span>Job Seeker</span>
                    </div>
                </button>

            </div>

        </header>
    )
}

export default Header