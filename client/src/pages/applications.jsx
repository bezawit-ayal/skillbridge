import { useState } from "react"
import {
    Search,
    MoreVertical,
    Briefcase,
    Eye,
    Pencil,
    Trash2
} from "lucide-react"

import { useOutletContext, useNavigate } from "react-router-dom"

import { useApplications } from "../context/application-context"
function Applications() {

    const {
        applications,
        updateApplication,
        deleteApplication
    } = useApplications()

    const {
        setEditingApplication,
        setShowApplicationForm
    } = useOutletContext()
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [openMenu, setOpenMenu] = useState(null)

    const filteredApplications = applications.filter((application) => {

        const searchText = search.toLowerCase()

        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.position.toLowerCase().includes(searchText) ||
            (application.location || "").toLowerCase().includes(searchText)

        const matchesStatus =
            statusFilter === "all" ||
            application.status === statusFilter

        return matchesSearch && matchesStatus
    })

    function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this application?"
        )

        if (!confirmed) {
            return
        }

        deleteApplication(id)

        setOpenMenu(null)
    }

    function handleViewDetails(id) {
        setOpenMenu(null)
        navigate(`/applications/${id}`)
    }

    return (
        <div className="applications-page">

            <div className="applications-heading">

                <div>
                    <span className="section-label">
                        Job search
                    </span>

                    <h2>Applications</h2>

                    <p>
                        Track and manage all your job applications.
                    </p>
                </div>

            </div>

            <div className="applications-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search company, position or location..."
                    />

                </div>

                <select
                    className="application-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>

            </div>

            <div className="applications-card">

                <div className="applications-table-header">
                    <span>Company / Position</span>
                    <span>Location</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {filteredApplications.map((application) => (

                    <div
                        className="applications-table-row"
                        key={application.id}
                    >

                        <div className="application-company-cell">

                            <div className="company-logo">
                                {application.company.charAt(0)}
                            </div>

                            <div>
                                <strong>{application.position}</strong>
                                <span>{application.company}</span>
                            </div>

                        </div>

                        <div className="application-location">
                            <span>
                                {application.location || "Not specified"}
                            </span>
                        </div>

                        <div>
                            <select
                                className="application-status-select"
                                value={application.status}
                                onChange={(event) => {
                                    const updatedApplication = {
                                        ...application,
                                        status: event.target.value
                                    }

                                    updateApplication(updatedApplication)
                                }}
                            >
                                <option value="Saved">Saved</option>
                                <option value="Applied">Applied</option>
                                <option value="Screening">Screening</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="application-action-wrapper">

                            <button
                                type="button"
                                className="application-action"
                                aria-label="Application actions"
                                onClick={() =>
                                    setOpenMenu(
                                        openMenu === application.id
                                            ? null
                                            : application.id
                                    )
                                }
                            >
                                <MoreVertical size={18} />
                            </button>

                            {openMenu === application.id && (

                                <div className="application-menu">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewDetails(application.id)
                                        }
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setEditingApplication(application)

                                            setShowApplicationForm(true)

                                            setOpenMenu(null)
                                        }}
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                `Are you sure you want to delete the application for ${application.company}?`
                                            )

                                            if (confirmed) {
                                                deleteApplication(application.id)
                                                setOpenMenu(null)
                                            }
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>

                            )}

                        </div>

                    </div>

                ))}

                {filteredApplications.length === 0 && (

                    <div className="applications-empty">

                        <Briefcase size={30} />

                        <h3>No applications found</h3>

                        <p>
                            Try a different search or status filter.
                        </p>

                    </div>

                )}

            </div>

        </div>
    )
}

export default Applications