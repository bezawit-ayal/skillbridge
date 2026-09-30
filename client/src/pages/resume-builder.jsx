import { useState } from "react"
import { useProfile } from "../context/profile-context"
import { Save, Printer, Download } from "lucide-react"
import html2pdf from "html2pdf.js"
function ResumeBuilder() {

    const { profile } = useProfile()

    const [resume, setResume] = useState({
        name: profile.name,
        title: profile.headline,
        email: profile.email,
        location: profile.location,
        summary: profile.bio,
        skills: profile.skills.join(", "),
        education: [],
        experience: [],
        projects: []
    })
    const [activeExperience, setActiveExperience] = useState(null)
    const [activeProject, setActiveProject] = useState(null)
    const [activeEducation, setActiveEducation] = useState(null)
    function handleDownload() {
        const resumeElement = document.querySelector(".resume-preview")

        const options = {
            margin: 0,
            filename: `${resume.name.replace(/\s+/g, "-").toLowerCase()}-resume.pdf`,
            image: {
                type: "jpeg",
                quality: 0.98
            },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        }

        html2pdf()
            .set(options)
            .from(resumeElement)
            .save()
    }
    function handleChange(event) {
        const { name, value } = event.target

        setResume((currentResume) => ({
            ...currentResume,
            [name]: value
        }))
    }

    function saveProject() {
        if (!activeProject) {
            return
        }

        if (!activeProject.name.trim()) {
            alert("Please enter a project name.")
            return
        }

        setResume((currentResume) => {

            const projectExists = currentResume.projects.some(
                (project) => project.id === activeProject.id
            )

            return {
                ...currentResume,

                projects: projectExists
                    ? currentResume.projects.map((project) =>
                        project.id === activeProject.id
                            ? { ...activeProject }
                            : project
                    )
                    : [
                        ...currentResume.projects,
                        { ...activeProject }
                    ]
            }
        })

        setActiveProject(null)
    }

    function saveExperience() {
        if (!activeExperience) {
            return
        }

        if (!activeExperience.jobTitle.trim()) {
            alert("Please enter a job title.")
            return
        }

        setResume((currentResume) => {
            const experienceExists = currentResume.experience.some(
                (experience) =>
                    experience.id === activeExperience.id
            )

            return {
                ...currentResume,

                experience: experienceExists
                    ? currentResume.experience.map((experience) =>
                        experience.id === activeExperience.id
                            ? { ...activeExperience }
                            : experience
                    )
                    : [
                        ...currentResume.experience,
                        { ...activeExperience }
                    ]
            }
        })

        setActiveExperience(null)
    }

    function saveEducation() {
        if (!activeEducation) {
            return
        }

        if (!activeEducation.school.trim()) {
            alert("Please enter a school or university.")
            return
        }

        setResume((currentResume) => {
            const educationExists = currentResume.education.some(
                (education) =>
                    education.id === activeEducation.id
            )

            return {
                ...currentResume,

                education: educationExists
                    ? currentResume.education.map((education) =>
                        education.id === activeEducation.id
                            ? { ...activeEducation }
                            : education
                    )
                    : [
                        ...currentResume.education,
                        { ...activeEducation }
                    ]
            }
        })

        setActiveEducation(null)
    }
    return (
        <div className="resume-builder-page">

            <section className="page-intro">

                <div>
                    <span className="section-label">
                        Career tool
                    </span>

                    <h2>Resume Builder</h2>

                    <p>
                        Create and organize your professional resume.
                    </p>
                </div>

            </section>


            <div className="resume-builder-layout">

                <section className="resume-form-card">

                    <div className="card-header">
                        <div>
                            <h3>Resume Information</h3>
                            <p>
                                Enter your information below.
                            </p>
                        </div>
                    </div>


                    <div className="resume-form">

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    value={resume.name}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="title">
                                    Professional Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    value={resume.title}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={resume.email}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="location">
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    value={resume.location}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label htmlFor="summary">
                                Professional Summary
                            </label>

                            <textarea
                                id="summary"
                                name="summary"
                                rows="5"
                                value={resume.summary}
                                onChange={handleChange}
                                placeholder="Write a short professional summary..."
                            />

                        </div>


                        <div className="form-group">

                            <label htmlFor="skills">
                                Skills
                            </label>

                            <textarea
                                id="skills"
                                name="skills"
                                rows="4"
                                value={resume.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, HTML, CSS..."
                            />

                        </div>


                        <div className="resume-builder-section">

                            <div className="resume-builder-section-heading">

                                <div>
                                    <h4>Education</h4>
                                    <p>Add your educational background.</p>
                                </div>

                                {!activeEducation && (
                                    <button
                                        type="button"
                                        className="resume-add-button"
                                        onClick={() => {
                                            setActiveEducation({
                                                id: Date.now(),
                                                school: "",
                                                degree: "",
                                                field: "",
                                                startDate: "",
                                                endDate: "",
                                                description: ""
                                            })
                                        }}
                                    >
                                        + Add Education
                                    </button>
                                )}

                            </div>


                            {/* Saved Education */}

                            {resume.education.length === 0 && !activeEducation && (
                                <div className="resume-section-empty">
                                    <p>No education added yet.</p>
                                </div>
                            )}


                            {resume.education.map((education) => (

                                <div
                                    className="resume-saved-experience"
                                    key={education.id}
                                >

                                    <div className="resume-saved-experience-content">

                                        <h5>
                                            {education.degree || "Degree"}
                                        </h5>

                                        <strong>
                                            {education.school || "School / University"}
                                        </strong>

                                        {education.field && (
                                            <span>
                                                {education.field}
                                            </span>
                                        )}

                                        {(education.startDate || education.endDate) && (
                                            <span>
                                                {education.startDate || "Start"}
                                                {" - "}
                                                {education.endDate || "Present"}
                                            </span>
                                        )}

                                        {education.description && (
                                            <p>
                                                {education.description}
                                            </p>
                                        )}

                                    </div>


                                    <div className="resume-saved-experience-actions">

                                        <button
                                            type="button"
                                            className="resume-edit-button"
                                            onClick={() => {
                                                setActiveEducation({
                                                    ...education
                                                })
                                            }}
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setResume((currentResume) => ({
                                                    ...currentResume,
                                                    education:
                                                        currentResume.education.filter(
                                                            (item) =>
                                                                item.id !== education.id
                                                        )
                                                }))
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}


                            {/* Active Education Form */}

                            {activeEducation && (

                                <div className="resume-entry-card">

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>School / University</label>

                                            <input
                                                type="text"
                                                value={activeEducation.school}
                                                onChange={(event) => {
                                                    setActiveEducation(
                                                        (currentEducation) => ({
                                                            ...currentEducation,
                                                            school:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Bahir Dar University"
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>Degree</label>

                                            <input
                                                type="text"
                                                value={activeEducation.degree}
                                                onChange={(event) => {
                                                    setActiveEducation(
                                                        (currentEducation) => ({
                                                            ...currentEducation,
                                                            degree:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Bachelor's Degree"
                                            />

                                        </div>

                                    </div>


                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>Field of Study</label>

                                            <input
                                                type="text"
                                                value={activeEducation.field}
                                                onChange={(event) => {
                                                    setActiveEducation(
                                                        (currentEducation) => ({
                                                            ...currentEducation,
                                                            field:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Computer Science"
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>Start Date</label>

                                            <input
                                                type="month"
                                                value={activeEducation.startDate}
                                                onChange={(event) => {
                                                    setActiveEducation(
                                                        (currentEducation) => ({
                                                            ...currentEducation,
                                                            startDate:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>End Date</label>

                                        <input
                                            type="month"
                                            value={activeEducation.endDate}
                                            onChange={(event) => {
                                                setActiveEducation(
                                                    (currentEducation) => ({
                                                        ...currentEducation,
                                                        endDate:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>Description</label>

                                        <textarea
                                            rows="4"
                                            value={activeEducation.description}
                                            onChange={(event) => {
                                                setActiveEducation(
                                                    (currentEducation) => ({
                                                        ...currentEducation,
                                                        description:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="Add relevant achievements, courses, activities, or other details..."
                                        />

                                    </div>


                                    <div className="resume-experience-form-actions">

                                        <button
                                            type="button"
                                            className="resume-save-experience-button"
                                            onClick={saveEducation}
                                        >
                                            Save
                                        </button>


                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setActiveEducation(null)
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>


                        <div className="resume-builder-section">

                            <div className="resume-builder-section-heading">

                                <div>
                                    <h4>Experience</h4>
                                    <p>Add your professional experience.</p>
                                </div>

                                {!activeExperience && (
                                    <button
                                        type="button"
                                        className="resume-add-button"
                                        onClick={() => {
                                            setActiveExperience({
                                                id: Date.now(),
                                                jobTitle: "",
                                                company: "",
                                                location: "",
                                                startDate: "",
                                                endDate: "",
                                                description: ""
                                            })
                                        }}
                                    >
                                        + Add Experience
                                    </button>
                                )}

                            </div>


                            {/* Saved Experiences */}

                            {resume.experience.length === 0 && !activeExperience && (
                                <div className="resume-section-empty">
                                    <p>No experience added yet.</p>
                                </div>
                            )}


                            {resume.experience.map((experience) => (

                                <div
                                    className="resume-saved-experience"
                                    key={experience.id}
                                >

                                    <div className="resume-saved-experience-content">

                                        <h5>
                                            {experience.jobTitle || "Job Title"}
                                        </h5>

                                        <strong>
                                            {experience.company || "Company Name"}
                                        </strong>

                                        {experience.location && (
                                            <span>
                                                {experience.location}
                                            </span>
                                        )}

                                        {(experience.startDate || experience.endDate) && (
                                            <span>
                                                {experience.startDate || "Start"}
                                                {" - "}
                                                {experience.endDate || "Present"}
                                            </span>
                                        )}

                                        {experience.description && (
                                            <p>
                                                {experience.description}
                                            </p>
                                        )}

                                    </div>


                                    <div className="resume-saved-experience-actions">

                                        <button
                                            type="button"
                                            className="resume-edit-button"
                                            onClick={() => {
                                                setActiveExperience({
                                                    ...experience
                                                })
                                            }}
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setResume((currentResume) => ({
                                                    ...currentResume,
                                                    experience:
                                                        currentResume.experience.filter(
                                                            (item) =>
                                                                item.id !== experience.id
                                                        )
                                                }))
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}


                            {/* Active Experience Form */}

                            {activeExperience && (

                                <div className="resume-entry-card">

                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>Job Title</label>

                                            <input
                                                type="text"
                                                value={activeExperience.jobTitle}
                                                onChange={(event) => {
                                                    setActiveExperience(
                                                        (currentExperience) => ({
                                                            ...currentExperience,
                                                            jobTitle:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Frontend Developer"
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>Company</label>

                                            <input
                                                type="text"
                                                value={activeExperience.company}
                                                onChange={(event) => {
                                                    setActiveExperience(
                                                        (currentExperience) => ({
                                                            ...currentExperience,
                                                            company:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Company name"
                                            />

                                        </div>

                                    </div>


                                    <div className="form-row">

                                        <div className="form-group">

                                            <label>Location</label>

                                            <input
                                                type="text"
                                                value={activeExperience.location}
                                                onChange={(event) => {
                                                    setActiveExperience(
                                                        (currentExperience) => ({
                                                            ...currentExperience,
                                                            location:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                                placeholder="Addis Ababa"
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>Start Date</label>

                                            <input
                                                type="month"
                                                value={activeExperience.startDate}
                                                onChange={(event) => {
                                                    setActiveExperience(
                                                        (currentExperience) => ({
                                                            ...currentExperience,
                                                            startDate:
                                                                event.target.value
                                                        })
                                                    )
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>End Date</label>

                                        <input
                                            type="month"
                                            value={activeExperience.endDate}
                                            onChange={(event) => {
                                                setActiveExperience(
                                                    (currentExperience) => ({
                                                        ...currentExperience,
                                                        endDate:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>Description</label>

                                        <textarea
                                            rows="4"
                                            value={activeExperience.description}
                                            onChange={(event) => {
                                                setActiveExperience(
                                                    (currentExperience) => ({
                                                        ...currentExperience,
                                                        description:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="Describe your responsibilities and achievements..."
                                        />

                                    </div>


                                    <div className="resume-experience-form-actions">

                                        <button
                                            type="button"
                                            className="resume-save-experience-button"
                                            onClick={saveExperience}
                                        >
                                            Save
                                        </button>


                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setActiveExperience(null)
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>



                        <div className="resume-builder-section">

                            <div className="resume-builder-section-heading">

                                <div>
                                    <h4>Projects</h4>
                                    <p>Add projects that demonstrate your skills and experience.</p>
                                </div>

                                {!activeProject && (
                                    <button
                                        type="button"
                                        className="resume-add-button"
                                        onClick={() => {
                                            setActiveProject({
                                                id: Date.now(),
                                                name: "",
                                                description: "",
                                                technologies: "",
                                                projectUrl: ""
                                            })
                                        }}
                                    >
                                        + Add Project
                                    </button>
                                )}

                            </div>

                            {resume.projects.length === 0 && !activeProject && (
                                <div className="resume-section-empty">
                                    <p>No projects added yet.</p>
                                </div>
                            )}

                            {resume.projects.map((project) => (
                                <div
                                    className="resume-saved-experience"
                                    key={project.id}
                                >
                                    <div className="resume-saved-experience-content">

                                        <h5>
                                            {project.name || "Project Name"}
                                        </h5>

                                        {project.technologies && (
                                            <strong>
                                                {project.technologies}
                                            </strong>
                                        )}

                                        {project.description && (
                                            <p>
                                                {project.description}
                                            </p>
                                        )}

                                        {project.projectUrl && (
                                            <span>
                                                {project.projectUrl}
                                            </span>
                                        )}

                                    </div>

                                    <div className="resume-saved-experience-actions">

                                        <button
                                            type="button"
                                            className="resume-edit-button"
                                            onClick={() => {
                                                setActiveProject({
                                                    ...project
                                                })
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setResume((currentResume) => ({
                                                    ...currentResume,
                                                    projects:
                                                        currentResume.projects.filter(
                                                            (item) =>
                                                                item.id !== project.id
                                                        )
                                                }))
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>
                                </div>
                            ))}

                            {activeProject && (
                                <div className="resume-entry-card">

                                    <div className="form-group">
                                        <label>Project Name</label>

                                        <input
                                            type="text"
                                            value={activeProject.name}
                                            onChange={(event) => {
                                                setActiveProject(
                                                    (currentProject) => ({
                                                        ...currentProject,
                                                        name: event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="SkillBridge"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Technologies</label>

                                        <input
                                            type="text"
                                            value={activeProject.technologies}
                                            onChange={(event) => {
                                                setActiveProject(
                                                    (currentProject) => ({
                                                        ...currentProject,
                                                        technologies:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Project URL</label>

                                        <input
                                            type="url"
                                            value={activeProject.projectUrl}
                                            onChange={(event) => {
                                                setActiveProject(
                                                    (currentProject) => ({
                                                        ...currentProject,
                                                        projectUrl:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>

                                        <textarea
                                            rows="4"
                                            value={activeProject.description}
                                            onChange={(event) => {
                                                setActiveProject(
                                                    (currentProject) => ({
                                                        ...currentProject,
                                                        description:
                                                            event.target.value
                                                    })
                                                )
                                            }}
                                            placeholder="Describe what you built, your role, and the main features..."
                                        />
                                    </div>

                                    <div className="resume-experience-form-actions">

                                        <button
                                            type="button"
                                            className="resume-save-experience-button"
                                            onClick={() => {
                                                if (!activeProject.name.trim()) {
                                                    alert("Please enter a project name.")
                                                    return
                                                }

                                                const existingProject = resume.projects.some(
                                                    (item) => item.id === activeProject.id
                                                )

                                                setResume((currentResume) => ({
                                                    ...currentResume,
                                                    projects: existingProject
                                                        ? currentResume.projects.map((item) =>
                                                            item.id === activeProject.id
                                                                ? activeProject
                                                                : item
                                                        )
                                                        : [
                                                            ...currentResume.projects,
                                                            activeProject
                                                        ]
                                                }))

                                                setActiveProject(null)
                                            }}
                                        >
                                            Save
                                        </button>


                                        <button
                                            type="button"
                                            className="resume-remove-button"
                                            onClick={() => {
                                                setActiveProject(null)
                                            }}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </section>


                <section className="resume-preview-card">

                    <div className="card-header">

                        <div>
                            <h3>Resume Preview</h3>

                            <p>
                                Your resume preview will update as you type.
                            </p>
                        </div>

                        <div className="resume-actions">

                            <button
                                type="button"
                                className="resume-action-button"
                                onClick={() => {
                                    alert("Resume saved successfully.")
                                }}
                            >
                                <Save size={16} />
                                Save
                            </button>

                            <button
                                type="button"
                                className="resume-action-button"
                                onClick={() => window.print()}
                            >
                                <Printer size={16} />
                                Print
                            </button>

                            <button
                                type="button"
                                className="resume-action-button resume-download-button"
                                onClick={handleDownload}
                            >
                                <Download size={16} />
                                Download
                            </button>

                        </div>

                    </div>


                    <div className="resume-preview">

                        <div className="resume-preview-header">

                            <h1>{resume.name}</h1>

                            <h2>{resume.title}</h2>

                            <p>
                                {resume.email}
                                {" · "}
                                {resume.location}
                            </p>

                        </div>


                        {resume.summary && (
                            <div className="resume-section">

                                <h3>Professional Summary</h3>

                                <p>
                                    {resume.summary}
                                </p>

                            </div>
                        )}


                        {resume.skills && (
                            <div className="resume-section">

                                <h3>Skills</h3>

                                <p>
                                    {resume.skills}
                                </p>

                            </div>
                        )}


                        {resume.education.length > 0 && (
                            <div className="resume-section">

                                <h3>Education</h3>

                                {resume.education.map((education) => (

                                    <div
                                        className="resume-preview-experience"
                                        key={education.id}
                                    >

                                        <div className="resume-preview-experience-header">

                                            <div>

                                                <h4>
                                                    {education.degree || "Degree"}
                                                </h4>

                                                <strong>
                                                    {education.school || "School / University"}
                                                </strong>

                                            </div>


                                            <div className="resume-preview-experience-meta">

                                                {education.startDate && (
                                                    <span>
                                                        {education.startDate}
                                                    </span>
                                                )}

                                                {education.endDate && (
                                                    <>
                                                        <span> - </span>

                                                        <span>
                                                            {education.endDate}
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </div>


                                        {education.field && (
                                            <p className="resume-preview-location">
                                                {education.field}
                                            </p>
                                        )}


                                        {education.description && (
                                            <p className="resume-preview-description">
                                                {education.description}
                                            </p>
                                        )}

                                    </div>

                                ))}

                            </div>
                        )}


                        {resume.experience.length > 0 && (
                            <div className="resume-section">

                                <h3>Experience</h3>

                                {resume.experience.map((experience) => (
                                    <div
                                        className="resume-preview-experience"
                                        key={experience.id}
                                    >

                                        <div className="resume-preview-experience-header">

                                            <div>
                                                <h4>
                                                    {experience.jobTitle || "Job Title"}
                                                </h4>

                                                <strong>
                                                    {experience.company || "Company Name"}
                                                </strong>
                                            </div>

                                            <div className="resume-preview-experience-meta">

                                                {experience.startDate && (
                                                    <span>
                                                        {experience.startDate}
                                                    </span>
                                                )}

                                                {experience.endDate && (
                                                    <>
                                                        <span> - </span>

                                                        <span>
                                                            {experience.endDate}
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </div>


                                        {experience.location && (
                                            <p className="resume-preview-location">
                                                {experience.location}
                                            </p>
                                        )}


                                        {experience.description && (
                                            <p className="resume-preview-description">
                                                {experience.description}
                                            </p>
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}


                        {resume.projects.length > 0 && (
                            <div className="resume-section">

                                <h3>Projects</h3>

                                {resume.projects.map((project) => (
                                    <div
                                        className="resume-preview-project"
                                        key={project.id}
                                    >
                                        <div className="resume-preview-project-header">

                                            <div>
                                                <h4>
                                                    {project.name}
                                                </h4>

                                                {project.technologies && (
                                                    <strong>
                                                        {project.technologies}
                                                    </strong>
                                                )}
                                            </div>

                                        </div>

                                        {project.description && (
                                            <p className="resume-preview-project-description">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.projectUrl && (
                                            <p className="resume-preview-project-url">
                                                {project.projectUrl}
                                            </p>
                                        )}

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>

                </section>

            </div>

        </div>
    )
}

export default ResumeBuilder