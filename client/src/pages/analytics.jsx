import {
    BarChart3,
    Briefcase,
    CalendarDays,
    CheckCircle2,
    Clock3,
    TrendingUp
} from "lucide-react"

import { useApplications } from "../context/application-context"
import { useInterviews } from "../context/interview-context"

function Analytics() {
    const { applications } = useApplications()
    const { interviews } = useInterviews()

    const totalApplications = applications.length

    const interviewsCount = interviews.length

    const offers = applications.filter(
        (application) => application.status === "Offer"
    ).length

    const accepted = applications.filter(
        (application) => application.status === "Accepted"
    ).length

    const rejected = applications.filter(
        (application) => application.status === "Rejected"
    ).length

    const applied = applications.filter(
        (application) => application.status === "Applied"
    ).length

    const screening = applications.filter(
        (application) => application.status === "Screening"
    ).length

    const interviewApplications = applications.filter(
        (application) => application.status === "Interview"
    ).length

    const saved = applications.filter(
        (application) => application.status === "Saved"
    ).length

    const responseRate = totalApplications
        ? Math.round(
            ((screening + interviewApplications + offers + accepted) /
                totalApplications) *
            100
        )
        : 0

    const offerRate = totalApplications
        ? Math.round((offers / totalApplications) * 100)
        : 0

    const pipeline = [
        {
            label: "Saved",
            value: saved
        },
        {
            label: "Applied",
            value: applied
        },
        {
            label: "Screening",
            value: screening
        },
        {
            label: "Interview",
            value: interviewApplications
        },
        {
            label: "Offer",
            value: offers
        },
        {
            label: "Accepted",
            value: accepted
        },
        {
            label: "Rejected",
            value: rejected
        }
    ]

    const maxPipelineValue = Math.max(
        ...pipeline.map((item) => item.value),
        1
    )

    return (
        <div className="analytics-page">

            <section className="analytics-intro">
                <div>
                    <div className="analytics-title-row">
                        <div className="analytics-page-icon">
                            <BarChart3 size={20} />
                        </div>

                        <div>
                            <h1>Analytics</h1>
                            <p>
                                Understand your job search performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="analytics-stats">

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon blue">
                        <Briefcase size={20} />
                    </div>

                    <div>
                        <span>Total Applications</span>
                        <strong>{totalApplications}</strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon purple">
                        <CalendarDays size={20} />
                    </div>

                    <div>
                        <span>Interviews</span>
                        <strong>{interviewsCount}</strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon green">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Offers</span>
                        <strong>{offers}</strong>
                    </div>
                </div>

                <div className="analytics-stat-card">
                    <div className="analytics-stat-icon orange">
                        <TrendingUp size={20} />
                    </div>

                    <div>
                        <span>Response Rate</span>
                        <strong>{responseRate}%</strong>
                    </div>
                </div>

            </section>

            <section className="analytics-grid">

                <div className="analytics-card pipeline-analytics-card">

                    <div className="analytics-card-header">
                        <div>
                            <h3>Application Pipeline</h3>
                            <p>
                                See how your applications move through each stage.
                            </p>
                        </div>
                    </div>

                    <div className="analytics-pipeline">

                        {pipeline.map((item) => (
                            <div
                                className="analytics-pipeline-item"
                                key={item.label}
                            >
                                <div className="analytics-pipeline-label">
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </div>

                                <div className="analytics-progress">
                                    <div
                                        className="analytics-progress-fill"
                                        style={{
                                            width: `${(item.value / maxPipelineValue) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="analytics-card performance-card">

                    <div className="analytics-card-header">
                        <div>
                            <h3>Performance Overview</h3>
                            <p>
                                Key numbers from your current job search.
                            </p>
                        </div>
                    </div>

                    <div className="performance-list">

                        <div className="performance-row">
                            <div className="performance-label">
                                <span>Response Rate</span>
                                <Clock3 size={16} />
                            </div>

                            <strong>{responseRate}%</strong>
                        </div>

                        <div className="performance-row">
                            <div className="performance-label">
                                <span>Offer Rate</span>
                                <TrendingUp size={16} />
                            </div>

                            <strong>{offerRate}%</strong>
                        </div>

                        <div className="performance-row">
                            <div className="performance-label">
                                <span>Accepted Offers</span>
                                <CheckCircle2 size={16} />
                            </div>

                            <strong>{accepted}</strong>
                        </div>

                        <div className="performance-row">
                            <div className="performance-label">
                                <span>Total Interviews</span>
                                <CalendarDays size={16} />
                            </div>

                            <strong>{interviewsCount}</strong>
                        </div>

                    </div>
                </div>

            </section>

            <section className="analytics-card analytics-insight-card">

                <div className="analytics-insight-icon">
                    <TrendingUp size={20} />
                </div>

                <div>
                    <h3>Career Insight</h3>

                    {totalApplications === 0 ? (
                        <p>
                            Start adding applications to see useful insights
                            about your job search performance.
                        </p>
                    ) : (
                        <p>
                            You currently have {totalApplications} application
                            {totalApplications !== 1 ? "s" : ""} in your tracker,
                            with {interviewsCount} interview
                            {interviewsCount !== 1 ? "s" : ""} and {offers} offer
                            {offers !== 1 ? "s" : ""}.
                        </p>
                    )}
                </div>

            </section>

        </div>
    )
}

export default Analytics