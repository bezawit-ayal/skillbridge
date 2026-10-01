
import { useEffect, useState } from "react"
import {
    Briefcase,
    Search,
    MapPin,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    SlidersHorizontal
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useApplications } from "../context/application-context"
import { apiRequest } from "../services/api"

function Jobs() {
    const [searchTerm, setSearchTerm] = useState("")
    const [locationFilter, setLocationFilter] = useState("All")
    const [typeFilter, setTypeFilter] = useState("All")

    const [jobs, setJobs] = useState([])
    const [savedJobs, setSavedJobs] = useState([])

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const { token } = useAuth()
    const { refreshApplications } = useApplications()

    // Fetch jobs from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true)
                setError("")

                const data = await apiRequest("jobs")

                setJobs(data.jobs || [])
            } catch (error) {
                console.error("Fetch jobs error:", error)
                setError(error.message || "Failed to load jobs")
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    // Fetch saved jobs
    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!token) {
                return
            }

            try {
                const data = await apiRequest("saved-jobs")

                const savedJobIds = (data.jobs || []).map(
                    (job) => job.id
                )

                setSavedJobs(savedJobIds)
            } catch (error) {
                console.error("Fetch saved jobs error:", error)
            }
        }

        fetchSavedJobs()
    }, [token])

    // Save or unsave a job
    const toggleSavedJob = async (jobId) => {
        if (!token) {
            setError("Please log in to save jobs.")
            return
        }

        const isSaved = savedJobs.includes(jobId)

        try {
            setError("")
            setMessage("")

            await apiRequest(`saved-jobs/${jobId}`, {
                method: isSaved ? "DELETE" : "POST"
            })

            if (isSaved) {
                setSavedJobs((currentSavedJobs) =>
                    currentSavedJobs.filter(
                        (id) => id !== jobId
                    )
                )
            } else {
                setSavedJobs((currentSavedJobs) => [
                    ...currentSavedJobs,
                    jobId
                ])
            }

            setMessage(
                isSaved
                    ? "Job removed from saved jobs."
                    : "Job saved successfully."
            )
        } catch (error) {
            console.error("Save job error:", error)
            setError(error.message || "Failed to update saved job")
        }
    }

    // Apply to a job
    const applyToJob = async (jobId) => {
        if (!token) {
            setError("Please log in to apply for jobs.")
            return
        }

        try {
            setError("")
            setMessage("")

            await apiRequest(`apply/${jobId}`, { method: "POST" })
            await refreshApplications()

            setMessage(
                "Application submitted successfully."
            )
        } catch (error) {
            console.error("Apply to job error:", error)
            setError(error.message || "Failed to apply for job")
        }
    }

    const filteredJobs = jobs.filter((job) => {
        const search = searchTerm.toLowerCase().trim()

        const jobType = job.job_type || job.type || ""

        const matchesSearch =
            !search ||
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search) ||
            (job.location || "").toLowerCase().includes(search)

        const matchesLocation =
            locationFilter === "All" ||
            job.location === locationFilter

        const matchesType =
            typeFilter === "All" ||
            jobType === typeFilter

        return matchesSearch && matchesLocation && matchesType
    })

    return (
        <div className="jobs-page">

            <section className="jobs-intro">
                <div className="jobs-title-row">

                    <div className="jobs-page-icon">
                        <Briefcase size={20} />
                    </div>

                    <div>
                        <h1>Jobs</h1>

                        <p>
                            Discover opportunities that match your
                            career goals.
                        </p>
                    </div>

                </div>
            </section>

            <section className="jobs-toolbar">

                <div className="jobs-search">
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search jobs, companies, or locations..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />
                </div>

                <div className="jobs-filter">
                    <SlidersHorizontal size={16} />

                    <select
                        value={locationFilter}
                        onChange={(event) =>
                            setLocationFilter(event.target.value)
                        }
                    >
                        <option value="All">
                            All locations
                        </option>

                        <option value="Addis Ababa">
                            Addis Ababa
                        </option>

                        <option value="Bahir Dar">
                            Bahir Dar
                        </option>

                        <option value="Remote">
                            Remote
                        </option>
                    </select>
                </div>

                <div className="jobs-filter">

                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(event.target.value)
                        }
                    >
                        <option value="All">
                            All job types
                        </option>

                        <option value="Full-time">
                            Full-time
                        </option>

                        <option value="Remote">
                            Remote
                        </option>

                        <option value="Contract">
                            Contract
                        </option>

                        <option value="Internship">
                            Internship
                        </option>
                    </select>

                </div>

            </section>

            {message && (
                <div className="jobs-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="jobs-error">
                    {error}
                </div>
            )}

            <div className="jobs-result-count">

                <span>
                    {loading
                        ? "Loading jobs..."
                        : `${filteredJobs.length} ${filteredJobs.length === 1
                            ? "job"
                            : "jobs"
                        } found`}
                </span>

                {savedJobs.length > 0 && (
                    <span>
                        {savedJobs.length} saved
                    </span>
                )}

            </div>

            {loading ? (
                <section className="jobs-empty">
                    <div className="jobs-empty-icon">
                        <Briefcase size={22} />
                    </div>

                    <h2>Loading jobs</h2>

                    <p>
                        Finding available opportunities...
                    </p>
                </section>
            ) : error && jobs.length === 0 ? (
                <section className="jobs-empty">
                    <div className="jobs-empty-icon">
                        <Search size={22} />
                    </div>

                    <h2>Unable to load jobs</h2>

                    <p>
                        {error}
                    </p>
                </section>
            ) : filteredJobs.length === 0 ? (
                <section className="jobs-empty">

                    <div className="jobs-empty-icon">
                        <Search size={22} />
                    </div>

                    <h2>No jobs found</h2>

                    <p>
                        Try changing your search or filters to find
                        more opportunities.
                    </p>

                </section>
            ) : (
                <section className="jobs-grid">

                    {filteredJobs.map((job) => {

                        const isSaved =
                            savedJobs.includes(job.id)

                        const jobType =
                            job.job_type || job.type || ""

                        return (
                            <article
                                className="job-card"
                                key={job.id}
                            >

                                <div className="job-card-top">

                                    <div className="job-company-icon">
                                        {job.company
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <button
                                        type="button"
                                        className={`job-save-button ${isSaved
                                                ? "saved"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            toggleSavedJob(job.id)
                                        }
                                        aria-label={
                                            isSaved
                                                ? "Remove saved job"
                                                : "Save job"
                                        }
                                    >
                                        {isSaved ? (
                                            <BookmarkCheck
                                                size={18}
                                            />
                                        ) : (
                                            <Bookmark
                                                size={18}
                                            />
                                        )}
                                    </button>

                                </div>

                                <div className="job-card-content">

                                    <h2>
                                        {job.title}
                                    </h2>

                                    <p className="job-company">
                                        {job.company}
                                    </p>

                                    <div className="job-meta">

                                        <span>
                                            <MapPin size={14} />
                                            {job.location ||
                                                "Location not specified"}
                                        </span>

                                        <span className="job-type">
                                            {jobType}
                                        </span>

                                    </div>

                                    <p className="job-description">
                                        {job.description ||
                                            "No description available."}
                                    </p>

                                </div>

                                <div className="job-card-actions">

                                    <button
                                        type="button"
                                        className="job-apply-button"
                                        onClick={() =>
                                            applyToJob(job.id)
                                        }
                                    >
                                        Apply

                                        <ExternalLink
                                            size={15}
                                        />
                                    </button>

                                </div>

                            </article>
                        )
                    })}

                </section>
            )}

        </div>
    )
}

export default Jobs
