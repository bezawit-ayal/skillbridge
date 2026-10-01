
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useProfile } from "../context/profile-context"
import { useAuth } from "../context/AuthContext"
import { apiRequest } from "../services/api"

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { setProfile } = useProfile()
    const { setToken, setUser } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)
            setError("")

            const data = await apiRequest("auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            })

            localStorage.setItem("skillbridge-token", data.token)
            localStorage.setItem("skillbridge-user", JSON.stringify(data.user))
            setToken(data.token)
            setUser(data.user)

            setProfile((profile) => ({
                ...profile,
                name: data.user.name,
                email: data.user.email
            }))

            navigate(location.state?.from || "/profile", { replace: true })
        } catch (error) {
            setError(
                error.message || "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-container">

                <div className="auth-header">
                    <h1>Sign in</h1>
                    <p>Continue to your SkillBridge account.</p>
                </div>

                {location.state?.registered && (
                    <div className="auth-success" role="status">
                        Account created. Sign in to create your profile.
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default Login

