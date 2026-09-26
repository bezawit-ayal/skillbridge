import { useState } from "react"
import { X } from "lucide-react"

import { useApplications } from "../../context/application-context"

function AddInterview({
    onClose,
    onAdd,
    initialInterview = null
}) {

    const { applications } = useApplications()

    const isEditing = Boolean(initialInterview)

    const [formData, setFormData] = useState({
        applicationId: initialInterview?.applicationId || "",
        type: initialInterview?.type || "Technical Interview",
        date: initialInterview?.date || "",
        time: initialInterview?.time || "",
        duration: initialInterview?.duration || 60,
        meetingUrl: initialInterview?.meetingUrl || "",
        notes: initialInterview?.notes || ""
    })


    function handleChange(event) {

        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }


    function saveInterview() {

        if (!formData.applicationId) {
            alert("Please select an application.")
            return
        }

        if (!formData.date) {
            alert("Please select an interview date.")
            return
        }

        if (!formData.time) {
            alert("Please select an interview time.")
            return
        }

        const interview = {
            ...(initialInterview || {}),
            ...formData,
            id: initialInterview?.id || Date.now(),
            duration: Number(formData.duration),
            status: initialInterview?.status || "Upcoming"
        }

        console.log("SAVING INTERVIEW:", interview)

        onAdd(interview)
    }


    function handleSubmit(event) {

        event.preventDefault()

        saveInterview()
    }


    return (
        <div className="modal-overlay">

            <div className="application-modal">

                <div className="modal-header">

                    <div>

                        <h2>
                            {isEditing
                                ? "Edit Interview"
                                : "Add Interview"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update your interview details."
                                : "Schedule an interview for a job application."}
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

                            <label>
                                Application *
                            </label>

                            <select
                                name="applicationId"
                                value={formData.applicationId}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select an application
                                </option>

                                {applications.map((application) => (

                                    <option
                                        key={application.id}
                                        value={application.id}
                                    >
                                        {application.position} — {application.company}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Interview Type
                            </label>

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >

                                <option value="Technical Interview">
                                    Technical Interview
                                </option>

                                <option value="Behavioral Interview">
                                    Behavioral Interview
                                </option>

                                <option value="HR Interview">
                                    HR Interview
                                </option>

                                <option value="Final Interview">
                                    Final Interview
                                </option>

                                <option value="Phone Interview">
                                    Phone Interview
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Date *
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Time *
                            </label>

                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Duration
                            </label>

                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            >

                                <option value="30">
                                    30 minutes
                                </option>

                                <option value="45">
                                    45 minutes
                                </option>

                                <option value="60">
                                    1 hour
                                </option>

                                <option value="90">
                                    1.5 hours
                                </option>

                                <option value="120">
                                    2 hours
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Meeting URL
                            </label>

                            <input
                                type="url"
                                name="meetingUrl"
                                value={formData.meetingUrl}
                                onChange={handleChange}
                                placeholder="https://meet.google.com/..."
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Preparation Notes
                        </label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="What do you need to prepare?"
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
                            onClick={saveInterview}
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Add Interview"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddInterview