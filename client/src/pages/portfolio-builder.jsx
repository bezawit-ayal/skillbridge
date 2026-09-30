import { useState } from "react"
import {
    Sparkles,
    Plus,
    Trash2,
    Pencil,
    Github,
    ExternalLink,
    X,
    FolderKanban
} from "lucide-react"

function PortfolioBuilder() {
    const [projects, setProjects] = useState([
        {
            id: 1,
            title: "Online Voting System",
            description:
                "A secure web-based voting platform that allows registered users to participate in elections while providing administrators with tools to manage candidates and results.",
            technologies: ["PHP", "MySQL", "HTML", "CSS"],
            role: "Full Stack Developer",
            github: "",
            live: ""
        }
    ])

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [generating, setGenerating] = useState(false)

    const [form, setForm] = useState({
        title: "",
        description: "",
        technologies: "",
        role: "",
        github: "",
        live: ""
    })

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            technologies: "",
            role: "",
            github: "",
            live: ""
        })
        setEditingId(null)
        setShowForm(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((previous) => ({
            ...previous,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form.title.trim() || !form.description.trim()) {
            return
        }

        const project = {
            id: editingId || Date.now(),
            title: form.title.trim(),
            description: form.description.trim(),
            technologies: form.technologies
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            role: form.role.trim(),
            github: form.github.trim(),
            live: form.live.trim()
        }

        if (editingId) {
            setProjects((previous) =>
                previous.map((item) =>
                    item.id === editingId ? project : item
                )
            )
        } else {
            setProjects((previous) => [...previous, project])
        }

        resetForm()
    }

    const editProject = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            technologies: project.technologies.join(", "),
            role: project.role,
            github: project.github,
            live: project.live
        })

        setEditingId(project.id)
        setShowForm(true)
    }

    const deleteProject = (id) => {
        setProjects((previous) =>
            previous.filter((project) => project.id !== id)
        )
    }

    const generateWithAI = () => {
        if (!form.title.trim()) {
            return
        }

        setGenerating(true)

        setTimeout(() => {
            setForm((previous) => ({
                ...previous,
                description:
                    `A professional ${previous.title} project designed to solve real-world problems through a practical and user-friendly digital experience. The project focuses on clean functionality, reliable performance, and an intuitive user interface.`,
                role:
                    previous.role || "Full Stack Developer"
            }))

            setGenerating(false)
        }, 1200)
    }

    return (
        <div className="portfolio-builder-page">

            <section className="portfolio-builder-header">
                <div>
                    <div className="portfolio-builder-heading">
                        <div className="portfolio-builder-icon">
                            <FolderKanban size={21} />
                        </div>

                        <div>
                            <h1>Portfolio Builder</h1>
                            <p>
                                Build and organize the projects you want to
                                showcase to employers.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="portfolio-add-button"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={17} />
                    Add Project
                </button>
            </section>

            <section className="portfolio-ai-banner">
                <div className="portfolio-ai-icon">
                    <Sparkles size={20} />
                </div>

                <div className="portfolio-ai-content">
                    <h2>Build your portfolio with AI</h2>
                    <p>
                        Enter your project details and let AI help you create
                        professional portfolio content.
                    </p>
                </div>
            </section>

            <section className="portfolio-projects-section">

                <div className="portfolio-section-header">
                    <div>
                        <h2>My Projects</h2>
                        <p>
                            {projects.length}{" "}
                            {projects.length === 1 ? "project" : "projects"}{" "}
                            in your portfolio
                        </p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="portfolio-empty-state">
                        <FolderKanban size={34} />

                        <h3>No projects yet</h3>

                        <p>
                            Add your first project and start building your
                            professional portfolio.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={16} />
                            Add Your First Project
                        </button>
                    </div>
                ) : (
                    <div className="portfolio-project-grid">

                        {projects.map((project) => (
                            <article
                                className="portfolio-project-card"
                                key={project.id}
                            >
                                <div className="portfolio-project-top">
                                    <div className="portfolio-project-folder">
                                        <FolderKanban size={19} />
                                    </div>

                                    <div className="portfolio-project-actions">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editProject(project)
                                            }
                                            aria-label="Edit project"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteProject(project.id)
                                            }
                                            aria-label="Delete project"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3>{project.title}</h3>

                                {project.role && (
                                    <span className="portfolio-project-role">
                                        {project.role}
                                    </span>
                                )}

                                <p className="portfolio-project-description">
                                    {project.description}
                                </p>

                                <div className="portfolio-tech-list">
                                    {project.technologies.map((technology) => (
                                        <span key={technology}>
                                            {technology}
                                        </span>
                                    ))}
                                </div>

                                <div className="portfolio-project-links">

                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Github size={15} />
                                            GitHub
                                        </a>
                                    )}

                                    {project.live && (
                                        <a
                                            href={project.live}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink size={15} />
                                            Live Demo
                                        </a>
                                    )}

                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

            {showForm && (
                <div
                    className="portfolio-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            resetForm()
                        }
                    }}
                >
                    <div className="portfolio-modal">

                        <div className="portfolio-modal-header">
                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Project"
                                        : "Add Project"}
                                </h2>

                                <p>
                                    Add your project information and use AI
                                    to improve the description.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                aria-label="Close"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="portfolio-form-group">
                                <label htmlFor="title">
                                    Project Name
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Online Voting System"
                                    required
                                />
                            </div>

                            <div className="portfolio-form-group">
                                <div className="portfolio-label-row">
                                    <label htmlFor="description">
                                        Project Description
                                    </label>

                                    <button
                                        type="button"
                                        className="portfolio-ai-button"
                                        onClick={generateWithAI}
                                        disabled={
                                            generating ||
                                            !form.title.trim()
                                        }
                                    >
                                        <Sparkles size={14} />

                                        {generating
                                            ? "Generating..."
                                            : "Generate with AI"}
                                    </button>
                                </div>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe what your project does..."
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="portfolio-form-row">

                                <div className="portfolio-form-group">
                                    <label htmlFor="technologies">
                                        Technologies
                                    </label>

                                    <input
                                        id="technologies"
                                        name="technologies"
                                        value={form.technologies}
                                        onChange={handleChange}
                                        placeholder="React, Node.js, MongoDB"
                                    />

                                    <small>
                                        Separate technologies with commas.
                                    </small>
                                </div>

                                <div className="portfolio-form-group">
                                    <label htmlFor="role">
                                        Your Role
                                    </label>

                                    <input
                                        id="role"
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                        placeholder="Frontend Developer"
                                    />
                                </div>

                            </div>

                            <div className="portfolio-form-row">

                                <div className="portfolio-form-group">
                                    <label htmlFor="github">
                                        GitHub URL
                                    </label>

                                    <input
                                        id="github"
                                        name="github"
                                        value={form.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div className="portfolio-form-group">
                                    <label htmlFor="live">
                                        Live Demo URL
                                    </label>

                                    <input
                                        id="live"
                                        name="live"
                                        value={form.live}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </div>

                            </div>

                            <div className="portfolio-form-actions">

                                <button
                                    type="button"
                                    className="portfolio-cancel-button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="portfolio-save-button"
                                >
                                    {editingId
                                        ? "Save Changes"
                                        : "Add Project"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default PortfolioBuilder