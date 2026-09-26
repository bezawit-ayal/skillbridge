import { useState } from "react"
import {
    Calendar,
    Clock,
    Video,
    Plus,
    MoreVertical,
    Pencil,
    Trash2
} from "lucide-react"

import { useInterviews } from "../context/interview-context"
import { useApplications } from "../context/application-context"

import AddInterview from "../components/interviews/add-interview"

function Interviews() {

    const {
        interviews,
        addInterview,
        updateInterview,
        deleteInterview
    } = useInterviews()

    const { applications } = useApplications()

    const [showForm, setShowForm] = useState(false)
    const [editingInterview, setEditingInterview] = useState(null)
    const [openMenu, setOpenMenu] = useState(null)


    function getApplication(interview) {

        return applications.find(
            (application) =>
                String(application.id) ===
                String(interview.applicationId)
        )
    }


    function handleSaveInterview(interview) {

        if (editingInterview) {

            updateInterview(interview)

        } else {

            addInterview(interview)
        }

        setShowForm(false)
        setEditingInterview(null)
    }

    function handleEditInterview(interview) {

        setEditingInterview(interview)

        setShowForm(true)

        setOpenMenu(null)
    }

    function handleDeleteInterview(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this interview?"
        )

        if (confirmed) {

            deleteInterview(id)

            setOpenMenu(null)
        }
    }


    return (
        <div className="interviews-page">

            <div className="page-heading">

                <div>
                    <h1>Interviews</h1>

                    <p>
                        Manage your upcoming and completed interviews.
                    </p>
                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} />
                    Add Interview
                </button>

            </div>


            <div className="interview-summary">

                <div className="summary-card">

                    <Calendar size={20} />

                    <div>
                        <span>Upcoming</span>
                        <strong>
                            {
                                interviews.filter(
                                    (interview) =>
                                        interview.status === "Upcoming"
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="summary-card">

                    <Clock size={20} />

                    <div>
                        <span>Total Interviews</span>
                        <strong>
                            {interviews.length}
                        </strong>
                    </div>

                </div>

            </div>


            <div className="interviews-card">

                <div className="card-header">

                    <div>
                        <h3>Interview Schedule</h3>

                        <p>
                            Your scheduled interviews
                        </p>
                    </div>

                </div>


                {interviews.length === 0 ? (

                    <div className="interviews-empty">

                        <Calendar size={36} />

                        <h3>No interviews yet</h3>

                        <p>
                            Add your first interview to start
                            tracking your schedule.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={18} />
                            Add Interview
                        </button>

                    </div>

                ) : (

                    <div className="interview-list">

                        {interviews.map((interview) => {

                            const application =
                                getApplication(interview)

                            return (

                                <div
                                    className="interview-item"
                                    key={interview.id}
                                >

                                    <div className="interview-date">

                                        <Calendar size={20} />

                                        <div>
                                            <strong>
                                                {interview.date}
                                            </strong>

                                            <span>
                                                {interview.time}
                                            </span>
                                        </div>

                                    </div>


                                    <div className="interview-main">

                                        <h4>
                                            {interview.type}
                                        </h4>

                                        <p>
                                            {application
                                                ? `${application.position} at ${application.company}`
                                                : "Application unavailable"}
                                        </p>

                                        <div className="interview-meta">

                                            <span>
                                                <Clock size={14} />
                                                {interview.duration} min
                                            </span>

                                            {interview.meetingUrl && (
                                                <a
                                                    href={interview.meetingUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <Video size={14} />
                                                    Join Meeting
                                                </a>
                                            )}

                                        </div>

                                    </div>


                                    <div className="interview-status">

                                        <select
                                            className={`interview-status-select ${interview.status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                            value={interview.status}
                                            onChange={(event) => {
                                                updateInterview({
                                                    ...interview,
                                                    status: event.target.value
                                                })
                                            }}
                                        >
                                            <option value="Upcoming">
                                                Upcoming
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>


                                        <div className="interview-action-wrapper">

                                            <button
                                                type="button"
                                                className="application-action"
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === interview.id
                                                            ? null
                                                            : interview.id
                                                    )
                                                }
                                            >
                                                <MoreVertical size={18} />
                                            </button>


                                            {openMenu === interview.id && (

                                                <div className="application-menu">

                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditInterview(interview)}
                                                    >
                                                        <Pencil size={16} />
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-action"
                                                        onClick={() =>
                                                            handleDeleteInterview(
                                                                interview.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )
                        })}

                    </div>

                )}

            </div>


            {showForm && (

                <AddInterview
                    onClose={() => {
                        setShowForm(false)
                        setEditingInterview(null)
                    }}
                    onAdd={handleSaveInterview}
                    initialInterview={editingInterview}
                />

            )}

        </div>
    )
}

export default Interviews