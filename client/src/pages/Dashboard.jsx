import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Plus,
    Search,
    Sparkles
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import { useApplications } from "../context/application-context"
import { useInterviews } from "../context/interview-context"

function Dashboard() {
    const navigate = useNavigate()

    const { applications } = useApplications()
    const { interviews } = useInterviews()

    const upcomingInterviews = interviews
        .filter((interview) => interview.status === "Upcoming")
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)

            return dateA - dateB
        })

    const nextInterview = upcomingInterviews[0]

    const recentApplications = [...applications]
        .sort((a, b) => b.id - a.id)
        .slice(0, 4)

    const savedApplications = applications.filter(
        (application) => application.status === "Saved"
    )

    const followUpApplications = applications.filter(
        (application) =>
            application.status === "Applied" ||
            application.status === "Screening"
    )

    const offers = applications.filter(
        (application) => application.status === "Offer"
    )

    const getApplication = (interview) => {
        return applications.find(
            (application) =>
                String(application.id) ===
                String(interview.applicationId)
        )
    }

    const getStatusClass = (status) => {
        return status
            .toLowerCase()
            .replace(/\s+/g, "-")
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-shell">

                {/* Header */}
                <section className="dashboard-header">

                    <div className="dashboard-welcome">

                        <span className="section-label">
                            Career dashboard
                        </span>

                        <h1>
                            Welcome back
                        </h1>

                        <p>
                            Stay on top of your job search and focus on
                            the opportunities that matter most.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="primary-button dashboard-find-button"
                        onClick={() => navigate("/jobs")}
                    >
                        <Search size={17} />
                        Find Jobs
                        <ArrowRight size={16} />
                    </button>

                </section>


                {/* Today's focus */}
                <section className="dashboard-section focus-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Today
                            </span>

                            <h2>
                                Today's focus
                            </h2>

                            <p>
                                A quick look at the things that may need
                                your attention.
                            </p>
                        </div>

                    </div>


                    <div className="focus-list">

                        {followUpApplications.length > 0 && (
                            <div className="focus-item">

                                <div className="focus-icon">
                                    <Clock3 size={19} />
                                </div>

                                <div className="focus-content">

                                    <strong>
                                        Follow up on your applications
                                    </strong>

                                    <span>
                                        You have {followUpApplications.length}{" "}
                                        application
                                        {followUpApplications.length !== 1
                                            ? "s"
                                            : ""}{" "}
                                        that may need attention.
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="text-button"
                                    onClick={() =>
                                        navigate("/applications")
                                    }
                                >
                                    Review
                                    <ArrowRight size={15} />
                                </button>

                            </div>
                        )}


                        {nextInterview && (
                            <div className="focus-item">

                                <div className="focus-icon">
                                    <CalendarDays size={19} />
                                </div>

                                <div className="focus-content">

                                    <strong>
                                        Prepare for your next interview
                                    </strong>

                                    <span>
                                        {nextInterview.type} ·{" "}
                                        {nextInterview.date} at{" "}
                                        {nextInterview.time}
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="text-button"
                                    onClick={() =>
                                        navigate("/interviews")
                                    }
                                >
                                    Prepare
                                    <ArrowRight size={15} />
                                </button>

                            </div>
                        )}


                        {savedApplications.length > 0 && (
                            <div className="focus-item">

                                <div className="focus-icon">
                                    <FileText size={19} />
                                </div>

                                <div className="focus-content">

                                    <strong>
                                        Review your saved opportunities
                                    </strong>

                                    <span>
                                        You have {savedApplications.length}{" "}
                                        saved job
                                        {savedApplications.length !== 1
                                            ? "s"
                                            : ""}.
                                    </span>

                                </div>

                                <button
                                    type="button"
                                    className="text-button"
                                    onClick={() =>
                                        navigate("/jobs")
                                    }
                                >
                                    View jobs
                                    <ArrowRight size={15} />
                                </button>

                            </div>
                        )}


                        {followUpApplications.length === 0 &&
                            !nextInterview &&
                            savedApplications.length === 0 && (
                                <div className="dashboard-empty-focus">

                                    <CheckCircle2 size={22} />

                                    <div>
                                        <strong>
                                            You're all caught up
                                        </strong>

                                        <span>
                                            There are no urgent actions
                                            waiting for you right now.
                                        </span>
                                    </div>

                                </div>
                            )}

                    </div>

                </section>


                {/* Next interview */}
                <section className="dashboard-section next-up-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Next up
                            </span>

                            <h2>
                                Your next interview
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="section-link"
                            onClick={() =>
                                navigate("/interviews")
                            }
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    {nextInterview ? (
                        <div className="next-interview">

                            <div className="next-interview-date">

                                <span>
                                    {nextInterview.date}
                                </span>

                                <strong>
                                    {nextInterview.time}
                                </strong>

                            </div>


                            <div className="next-interview-main">

                                <span className="interview-type">
                                    {nextInterview.type}
                                </span>

                                <h3>
                                    {getApplication(nextInterview)
                                        ? getApplication(nextInterview)
                                            .position
                                        : "Interview"}
                                </h3>

                                <p>
                                    {getApplication(nextInterview)
                                        ? getApplication(nextInterview)
                                            .company
                                        : "Application unavailable"}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="outline-button"
                                onClick={() =>
                                    navigate("/interviews")
                                }
                            >
                                View interview
                                <ArrowRight size={15} />
                            </button>

                        </div>
                    ) : (
                        <div className="empty-section">

                            <CalendarDays size={22} />

                            <div>
                                <strong>
                                    No upcoming interviews
                                </strong>

                                <span>
                                    Your scheduled interviews will appear
                                    here.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="outline-button"
                                onClick={() =>
                                    navigate("/interviews")
                                }
                            >
                                Add interview
                            </button>

                        </div>
                    )}

                </section>


                {/* Needs attention */}
                <section className="dashboard-section attention-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Keep moving
                            </span>

                            <h2>
                                Needs your attention
                            </h2>

                            <p>
                                Applications that may benefit from your
                                next action.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="section-link"
                            onClick={() =>
                                navigate("/applications")
                            }
                        >
                            View applications
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    {followUpApplications.length > 0 ? (
                        <div className="attention-list">

                            {followUpApplications
                                .slice(0, 4)
                                .map((application) => (
                                    <div
                                        className="attention-item"
                                        key={application.id}
                                    >

                                        <div className="company-mark">
                                            {application.company
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>


                                        <div className="attention-info">

                                            <strong>
                                                {application.position}
                                            </strong>

                                            <span>
                                                {application.company}
                                            </span>

                                        </div>


                                        <span
                                            className={`status-badge ${getStatusClass(
                                                application.status
                                            )}`}
                                        >
                                            {application.status}
                                        </span>


                                        <button
                                            type="button"
                                            className="row-action"
                                            onClick={() =>
                                                navigate(
                                                    `/applications/${application.id}`
                                                )
                                            }
                                        >
                                            <ArrowRight size={16} />
                                        </button>

                                    </div>
                                ))}

                        </div>
                    ) : (
                        <div className="empty-section">

                            <CheckCircle2 size={22} />

                            <div>
                                <strong>
                                    Nothing needs your attention
                                </strong>

                                <span>
                                    Your applications are currently up to
                                    date.
                                </span>
                            </div>

                        </div>
                    )}

                </section>


                {/* Recommended jobs */}
                <section className="dashboard-section recommendation-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Discover
                            </span>

                            <h2>
                                Recommended for you
                            </h2>

                            <p>
                                Explore opportunities and keep your search
                                moving forward.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="section-link"
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            Explore jobs
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="recommendation-content">

                        <div className="recommendation-icon">
                            <Sparkles size={21} />
                        </div>

                        <div className="recommendation-text">

                            <strong>
                                Find your next opportunity
                            </strong>

                            <span>
                                Search available jobs, filter by your
                                skills and save opportunities you want
                                to revisit.
                            </span>

                        </div>

                        <button
                            type="button"
                            className="outline-button"
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            Browse jobs
                            <ArrowRight size={15} />
                        </button>

                    </div>

                </section>


                {/* Recent activity */}
                <section className="dashboard-section activity-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Activity
                            </span>

                            <h2>
                                Recent applications
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="section-link"
                            onClick={() =>
                                navigate("/applications")
                            }
                        >
                            View all
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    {recentApplications.length > 0 ? (
                        <div className="activity-list">

                            {recentApplications.map((application) => (
                                <div
                                    className="activity-item"
                                    key={application.id}
                                >

                                    <div className="activity-company">
                                        {application.company
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>


                                    <div className="activity-info">

                                        <strong>
                                            {application.position}
                                        </strong>

                                        <span>
                                            {application.company}
                                        </span>

                                    </div>


                                    <span
                                        className={`status-badge ${getStatusClass(
                                            application.status
                                        )}`}
                                    >
                                        {application.status}
                                    </span>

                                </div>
                            ))}

                        </div>
                    ) : (
                        <div className="empty-section">

                            <FileText size={22} />

                            <div>
                                <strong>
                                    No applications yet
                                </strong>

                                <span>
                                    Start your job search by adding an
                                    application.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="outline-button"
                                onClick={() =>
                                    navigate("/applications")
                                }
                            >
                                Add application
                            </button>

                        </div>
                    )}

                </section>


                {/* Quick actions */}
                <section className="dashboard-section quick-actions-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <span className="section-label">
                                Shortcuts
                            </span>

                            <h2>
                                Quick actions
                            </h2>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/applications")
                            }
                        >
                            <Plus size={18} />
                            <span>
                                Add application
                            </span>
                            <ArrowRight size={15} />
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/interviews")
                            }
                        >
                            <Plus size={18} />
                            <span>
                                Add interview
                            </span>
                            <ArrowRight size={15} />
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            <Plus size={18} />
                            <span>
                                Save a job
                            </span>
                            <ArrowRight size={15} />
                        </button>

                    </div>

                </section>

            </div>

        </div>
    )
}

export default Dashboard