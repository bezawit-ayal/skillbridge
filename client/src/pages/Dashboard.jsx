import {
    Briefcase,
    CalendarDays,
    Bookmark,
    FileCheck,
    ArrowRight
} from "lucide-react"

import { useApplications } from "../context/application-context"
import { useInterviews } from "../context/interview-context"
function Dashboard() {

    const { applications } = useApplications()
    const { interviews } = useInterviews()
    const upcomingInterviews = interviews
        .filter((interview) => interview.status === "Upcoming")
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)

            return dateA - dateB
        })
        .slice(0, 3)
    const recentApplications = [...applications]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
    const pipelineStatuses = [
        "Saved",
        "Applied",
        "Screening",
        "Interview",
        "Offer",
        "Accepted",
        "Rejected"
    ]

    const pipeline = pipelineStatuses.map((status) => ({
        status,
        count: applications.filter(
            (application) => application.status === status
        ).length
    }))

    const totalApplications = applications.length

    const interviewsCount = interviews.length

    const offers = applications.filter(
        application => application.status === "Offer"
    ).length

    const saved = applications.filter(
        application => application.status === "Saved"
    ).length

    const applied = applications.filter(
        application => application.status === "Applied"
    ).length

    return (
        <div className="dashboard-page">

            <section className="dashboard-intro">

                <div>
                    <span className="section-label">
                        Career overview
                    </span>

                    <h2>Your job search at a glance</h2>

                    <p>
                        Track your applications, interviews and career progress
                        from one place.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                >
                    Find Jobs
                    <ArrowRight size={17} />
                </button>

            </section>

            <section className="dashboard-card upcoming-interviews-card">

                <div className="card-header">
                    <div>
                        <h3>Upcoming Interviews</h3>
                        <p>Your next scheduled interviews</p>
                    </div>
                </div>

                {upcomingInterviews.length === 0 ? (

                    <div className="dashboard-empty">
                        <p>No upcoming interviews.</p>
                    </div>

                ) : (

                    <div className="upcoming-interviews-list">

                        {upcomingInterviews.map((interview) => {

                            const application = applications.find(
                                (application) =>
                                    String(application.id) ===
                                    String(interview.applicationId)
                            )

                            return (
                                <div
                                    className="upcoming-interview-item"
                                    key={interview.id}
                                >

                                    <div className="upcoming-interview-date">
                                        <strong>
                                            {interview.date}
                                        </strong>

                                        <span>
                                            {interview.time}
                                        </span>
                                    </div>

                                    <div className="upcoming-interview-info">

                                        <h4>
                                            {interview.type}
                                        </h4>

                                        <p>
                                            {application
                                                ? `${application.position} at ${application.company}`
                                                : "Application unavailable"}
                                        </p>

                                    </div>

                                </div>
                            )
                        })}

                    </div>
                )}

            </section>
            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        <Briefcase size={20} />
                    </div>

                    <div>
                        <span>Total Applications</span>
                        <strong>{totalApplications}</strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <span>Interviews</span>
                        <strong>{interviewsCount}</strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <Bookmark size={20} />
                    </div>

                    <div>
                        <span>Saved Jobs</span>
                        <strong>{saved}</strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <FileCheck size={20} />
                    </div>

                    <div>
                        <span>Offers</span>
                        <strong>{offers}</strong>
                    </div>

                </div>

            </section>


            <section className="dashboard-card pipeline-card">

                <div className="card-header">
                    <div>
                        <h3>Application Pipeline</h3>
                        <p>Track your applications by stage</p>
                    </div>
                </div>

                <div className="pipeline-list">

                    {pipeline.map((item) => (

                        <div
                            className="pipeline-item"
                            key={item.status}
                        >

                            <div className="pipeline-item-info">

                                <span className="pipeline-status">
                                    {item.status}
                                </span>

                                <span className="pipeline-count">
                                    {item.count}
                                </span>

                            </div>

                            <div className="pipeline-bar">

                                <div
                                    className="pipeline-bar-fill"
                                    style={{
                                        width: `${applications.length
                                            ? (item.count / applications.length) * 100
                                            : 0}%`
                                    }}
                                />

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            <div className="recent-applications-list">

                {recentApplications.length === 0 ? (

                    <div className="applications-empty">
                        <p>No applications yet.</p>
                    </div>

                ) : (

                    recentApplications.map((application) => (

                        <div
                            className="recent-application-item"
                            key={application.id}
                        >

                            <div className="recent-application-info">

                                <div className="application-company-icon">
                                    {application.company
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h4>{application.position}</h4>
                                    <p>{application.company}</p>
                                </div>

                            </div>

                            <span
                                className={`status-badge ${application.status
                                    .toLowerCase()
                                    .replace(" ", "-")}`}
                            >
                                {application.status}
                            </span>

                        </div>

                    ))

                )}

            </div>

        </div>
    )
}

export default Dashboard