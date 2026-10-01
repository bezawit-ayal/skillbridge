import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { apiRequest } from "../services/api"

function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setLoading(true)
            setError("")

            await apiRequest("auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            })

            navigate("/login", { state: { registered: true } })
        } catch (requestError) {
            setError(requestError.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-container">
                <div className="auth-header">
                    <h1>Create your account</h1>
                    <p>Register to start building your career profile.</p>
                </div>

                {error && <div className="auth-error" role="alert">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label htmlFor="register-name">Name</label>
                        <input
                            id="register-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-email">Email</label>
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            minLength={6}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    )
}

export default Register