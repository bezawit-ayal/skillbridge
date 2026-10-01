const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "")

export async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {})
    const token = localStorage.getItem("skillbridge-token")

    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(
        `${API_BASE_URL}/${path.replace(/^\/+/, "")}`,
        { ...options, headers }
    )
    const data = await response.json().catch(() => ({}))

    if (response.status === 401) {
        localStorage.removeItem("skillbridge-token")
        localStorage.removeItem("skillbridge-user")
        window.dispatchEvent(new Event("skillbridge:unauthorized"))
    }

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`)
    }

    return data
}
