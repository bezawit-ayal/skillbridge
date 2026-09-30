import { useState } from "react"
import {
    Briefcase,
    Search,
    MapPin,
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    SlidersHorizontal
} from "lucide-react"

function Jobs() {
    const [searchTerm, setSearchTerm] = useState("")
    const [locationFilter, setLocationFilter] = useState("All")
    const [typeFilter, setTypeFilter] = useState("All")
    const [savedJobs, setSavedJobs] = useState([])

    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Solutions",
            location: "Addis Ababa",
            type: "Full-time",
            description:
                "Build responsive web applications using React, JavaScript, and modern frontend technologies."
        },
        {
            id: 2,
            title: "React Developer",
            company: "Digital Ethiopia",
            location: "Remote",
            type: "Remote",
            description:
                "Work with a development team to create scalable React applications and reusable components."
        },
        {
            id: 3,
            title: "Junior Web Developer",
            company: "Web Systems",
            location: "Addis Ababa",
            type: "Full-time",
            description:
                "Join a growing team and develop websites using HTML, CSS, JavaScript, and backend technologies."
        },
        {
            id: 4,
            title: "UI Developer",
            company: "Creative Digital",
            location: "Remote",
            type: "Contract",
            description:
                "Turn design concepts into accessible, responsive, and polished user interfaces."
        },
        {
            id: 5,
            title: "Full Stack Developer",
            company: "Software Hub",
            location: "Addis Ababa",
            type: "Full-time",
            description:
                "Develop complete web applications using React, Node.js, Express, and database technologies."
        },
        {
            id: 6,
            title: "Frontend Intern",
            company: "Innovation Labs",
            location: "Remote",
            type: "Internship",
            description:
                "Gain practical experience building modern web interfaces while working with experienced developers."
        }
    ]

    function toggleSavedJob(id) {
        setSavedJobs((currentSavedJobs) =>
            currentSavedJobs.includes(id)
                ? currentSavedJobs.filter((jobId) => jobId !== id)
                : [...currentSavedJobs, id]
        )
    }

    const filteredJobs = jobs.filter((job) => {
        const search = searchTerm.toLowerCase().trim()

        const matchesSearch =
            !search ||
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search) ||
            job.location.toLowerCase().includes(search)

        const matchesLocation =
            locationFilter === "All" ||
            job.location === locationFilter

        const matchesType =
            typeFilter === "All" ||
            job.type === typeFilter

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
                            Discover opportunities that match your career goals.
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
                        <option value="All">All locations</option>
                        <option value="Addis Ababa">Addis Ababa</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                <div className="jobs-filter">
                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            setTypeFilter(event.target.value)
                        }
                    >
                        <option value="All">All job types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

            </section>

            <div className="jobs-result-count">
                <span>
                    {filteredJobs.length}{" "}
                    {filteredJobs.length === 1 ? "job" : "jobs"} found
                </span>

                {savedJobs.length > 0 && (
                    <span>
                        {savedJobs.length} saved
                    </span>
                )}
            </div>

            {filteredJobs.length === 0 ? (
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
                        const isSaved = savedJobs.includes(job.id)

                        return (
                            <article
                                className="job-card"
                                key={job.id}
                            >
                                <div className="job-card-top">

                                    <div className="job-company-icon">
                                        {job.company.charAt(0)}
                                    </div>

                                    <button
                                        type="button"
                                        className={`job-save-button ${isSaved ? "saved" : ""
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
                                            <BookmarkCheck size={18} />
                                        ) : (
                                            <Bookmark size={18} />
                                        )}
                                    </button>

                                </div>

                                <div className="job-card-content">

                                    <h2>{job.title}</h2>

                                    <p className="job-company">
                                        {job.company}
                                    </p>

                                    <div className="job-meta">

                                        <span>
                                            <MapPin size={14} />
                                            {job.location}
                                        </span>

                                        <span className="job-type">
                                            {job.type}
                                        </span>

                                    </div>

                                    <p className="job-description">
                                        {job.description}
                                    </p>

                                </div>

                                <div className="job-card-actions">

                                    <button
                                        type="button"
                                        className="job-apply-button"
                                        onClick={() =>
                                            alert(
                                                `Application started for ${job.title} at ${job.company}.`
                                            )
                                        }
                                    >
                                        Apply
                                        <ExternalLink size={15} />
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