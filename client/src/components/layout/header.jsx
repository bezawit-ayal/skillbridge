import { Menu, Bell, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useProfile } from "../../context/profile-context"

function Header({ onMenuClick, onNewApplication }) {

    const navigate = useNavigate()
    const { profile } = useProfile()

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

                    <h1>
                        Good morning, {profile.name}
                    </h1>
                </div>

            </div>


            <div className="header-actions">

                <button
                    type="button"
                    className="add-button"
                    onClick={onNewApplication}
                >
                    <span>Add New Application</span>
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
                    onClick={() => navigate("/profile")}
                >
                    <div className="profile-avatar">
                        {profile.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={profile.name}
                                className="profile-avatar-image"
                            />
                        ) : (
                            profile.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="profile-info">
                        <strong>{profile.name}</strong>
                        <span>Job Seeker</span>
                    </div>
                </button>

            </div>

        </header>
    )
}

export default Header