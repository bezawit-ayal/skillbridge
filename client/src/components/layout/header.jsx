import { Menu, Bell, LogIn, LogOut, UserPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useProfile } from "../../context/profile-context"
import { useAuth } from "../../context/AuthContext"

function Header({ onMenuClick, onNewApplication }) {

    const navigate = useNavigate()
    const { profile } = useProfile()
    const { token, logout } = useAuth()
    const isAuthenticated = Boolean(token)

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

            </div>


            <div className="header-actions">

                {!isAuthenticated ? (
                    <>
                        <button
                            type="button"
                            className="auth-nav-button"
                            onClick={() => navigate("/login")}
                        >
                            <LogIn size={16} />
                            Log in
                        </button>
                        <button
                            type="button"
                            className="auth-nav-button auth-nav-primary"
                            onClick={() => navigate("/register")}
                        >
                            <UserPlus size={16} />
                            Register
                        </button>
                    </>
                ) : (
                    <>
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

                        <button
                            type="button"
                            className="icon-button"
                            aria-label="Log out"
                            title="Log out"
                            onClick={() => {
                                logout()
                                navigate("/login", { replace: true })
                            }}
                        >
                            <LogOut size={18} />
                        </button>
                    </>
                )}

            </div>

        </header>
    )
}

export default Header