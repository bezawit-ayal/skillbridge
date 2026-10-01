import { useApplications } from "../context/application-context"
import {
    ArrowLeft,
    MapPin,
    Briefcase,
    CalendarDays,
    DollarSign,
    ExternalLink,
    Pencil,
    Trash2
} from "lucide-react"

import {
    useNavigate,
    useOutletContext,
    useParams
} from "react-router-dom"

function ApplicationDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const {
        applications,
        deleteApplication
    } = useApplications()
    const {
        setEditingApplication,
        setShowApplicationForm
    } = useOutletContext()

    const application = applications.find(
        (item) => String(item.id) === String(id)
    )

    if (!application) {
        return (
            <div className="application-details-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/applications")}
                >
                    <ArrowLeft size={18} />
                    Back to Applications
                </button>

                <div className="details-not-found">
                    <h2>Application not found</h2>

                    <p>
                        This application may have been deleted or does not exist.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => navigate("/applications")}
                    >
                        Back to Applications
                    </button>
                </div>

            </div>
        )
    }

    function handleDelete() {

        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        )

        if (!confirmed) {
            return
        }

        deleteApplication(application.id)

        navigate("/applications")
    }

    return (
        <div className="application-details-page">

            <button
                type="button"
                className="back-button"
                onClick={() => navigate("/applications")}
            >
                <ArrowLeft size={18} />
                Back to Applications
            </button>

            <div className="details-header">

                <div className="details-title">

                    <div className="details-company-logo">
                        {application.company.charAt(0)}
                    </div>

                    <div>
                        <span className="section-label">
                            Job Application
                        </span>

                        <h2>{application.position}</h2>

                        <p>{application.company}</p>
                    </div>

                </div>

                <div className="details-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setEditingApplication(application)
                            setShowApplicationForm(true)
                        }}
                    >
                        <Pencil size={17} />
                        Edit
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={handleDelete}
                    >
                        <Trash2 size={17} />
                        Delete
                    </button>

                </div>

            </div>

            <div className="details-grid">

                <div className="details-main-card">

                    <div className="details-card-header">
                        <div>
                            <h3>Application Information</h3>
                            <p>Important details about this application.</p>
                        </div>

                        <span
                            className={`status-badge status-${application.status.toLowerCase()}`}
                        >
                            {application.status}
                        </span>
                    </div>

                    <div className="details-info-grid">

                        <div className="details-info-item">
                            <Briefcase size={18} />

                            <div>
                                <span>Position</span>
                                <strong>{application.position}</strong>
                            </div>
                        </div>

                        <div className="details-info-item">
                            <MapPin size={18} />

                            <div>
                                <span>Location</span>
                                <strong>
                                    {application.location || "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="details-info-item">
                            <DollarSign size={18} />

                            <div>
                                <span>Salary</span>
                                <strong>
                                    {application.salary || "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="details-info-item">
                            <Briefcase size={18} />

                            <div>
                                <span>Job Type</span>
                                <strong>
                                    {application.jobType || "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="details-info-item">
                            <CalendarDays size={18} />

                            <div>
                                <span>Applied Date</span>
                                <strong>
                                    {application.appliedDate || "Not specified"}
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="details-side-card">

                    <h3>Job Posting</h3>

                    <p>
                        Open the original job posting if you saved its URL.
                    </p>

                    {application.jobUrl ? (
                        <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="job-link"
                        >
                            <ExternalLink size={17} />
                            Open Job Posting
                        </a>
                    ) : (
                        <span className="no-link">
                            No job URL added
                        </span>
                    )}

                </div>

            </div>

            <div className="details-notes-card">

                <h3>Notes</h3>

                <p>
                    {application.notes ||
                        "No notes have been added for this application."}
                </p>

            </div>

        </div>
    )
}

export default ApplicationDetails