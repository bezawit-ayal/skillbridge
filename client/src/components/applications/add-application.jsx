import { useState } from "react"
import { X } from "lucide-react"

function AddApplication({
    onClose,
    onAdd,
    initialApplication = null
}) {

    const isEditing = Boolean(initialApplication)

    const [formData, setFormData] = useState({
        company: initialApplication?.company || "",
        position: initialApplication?.position || "",
        location: initialApplication?.location || "",
        salary: initialApplication?.salary || "",
        jobType: initialApplication?.jobType || "Full-time",
        status: initialApplication?.status || "Applied",
        appliedDate: initialApplication?.appliedDate || "",
        jobUrl: initialApplication?.jobUrl || "",
        notes: initialApplication?.notes || ""
    })

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    function saveApplication() {

        if (!formData.company.trim()) {
            alert("Please enter the company name.")
            return
        }

        if (!formData.position.trim()) {
            alert("Please enter the position.")
            return
        }

        const application = {
            ...(initialApplication || {}),
            ...formData,
            id: initialApplication?.id || Date.now()
        }

        console.log("SAVING APPLICATION:", application)

        onAdd(application)
    }

    function handleSubmit(event) {
        event.preventDefault()
        saveApplication()
    }

    return (
        <div className="modal-overlay">

            <div className="application-modal">

                <div className="modal-header">

                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Application"
                                : "Add Application"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update your application details."
                                : "Track a new job application."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>

                <form
                    className="application-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Company *</label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Example: Microsoft"
                            />
                        </div>

                        <div className="form-group">
                            <label>Position *</label>

                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="Example: Frontend Developer"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Example: Addis Ababa"
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Example: 25,000 ETB"
                            />
                        </div>

                        <div className="form-group">
                            <label>Job Type</label>

                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                            >
                                <option value="Full-time">
                                    Full-time
                                </option>

                                <option value="Part-time">
                                    Part-time
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>

                                <option value="Remote">
                                    Remote
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Saved">Saved</option>
                                <option value="Applied">Applied</option>
                                <option value="Screening">
                                    Screening
                                </option>
                                <option value="Interview">
                                    Interview
                                </option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">
                                    Rejected
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Applied Date</label>

                            <input
                                type="date"
                                name="appliedDate"
                                value={formData.appliedDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Job URL</label>

                            <input
                                type="url"
                                name="jobUrl"
                                value={formData.jobUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                    </div>

                    <div className="form-group">

                        <label>Notes</label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any notes about this application..."
                            rows="4"
                        />

                    </div>

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="save-button"
                            onClick={saveApplication}
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Add Application"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddApplication