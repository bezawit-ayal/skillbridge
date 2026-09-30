
import { useMemo, useState } from "react"
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Code2,
    Palette,
    Database,
    Users,
    Wrench
} from "lucide-react"

function ManageSkills() {
    const [skills, setSkills] = useState([
        {
            id: 1,
            name: "JavaScript",
            category: "Programming",
            level: "Advanced"
        },
        {
            id: 2,
            name: "React",
            category: "Frontend",
            level: "Intermediate"
        },
        {
            id: 3,
            name: "HTML",
            category: "Frontend",
            level: "Advanced"
        },
        {
            id: 4,
            name: "CSS",
            category: "Frontend",
            level: "Advanced"
        }
    ])

    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [showForm, setShowForm] = useState(false)
    const [editingSkill, setEditingSkill] = useState(null)

    const [form, setForm] = useState({
        name: "",
        category: "Frontend",
        level: "Beginner"
    })

    const categories = [
        "Frontend",
        "Backend",
        "Programming",
        "Database",
        "Design",
        "Soft Skills",
        "Tools"
    ]

    const levels = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert"
    ]

    const categoryIcons = {
        Frontend: Code2,
        Backend: Wrench,
        Programming: Code2,
        Database: Database,
        Design: Palette,
        "Soft Skills": Users,
        Tools: Wrench
    }

    const filteredSkills = useMemo(() => {
        return skills.filter((skill) => {
            const matchesSearch =
                skill.name
                    .toLowerCase()
                    .includes(search.toLowerCase())

            const matchesCategory =
                categoryFilter === "All" ||
                skill.category === categoryFilter

            return matchesSearch && matchesCategory
        })
    }, [skills, search, categoryFilter])

    function openAddForm() {
        setEditingSkill(null)

        setForm({
            name: "",
            category: "Frontend",
            level: "Beginner"
        })

        setShowForm(true)
    }

    function openEditForm(skill) {
        setEditingSkill(skill)

        setForm({
            name: skill.name,
            category: skill.category,
            level: skill.level
        })

        setShowForm(true)
    }

    function closeForm() {
        setShowForm(false)
        setEditingSkill(null)
    }

    function handleChange(event) {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (!form.name.trim()) {
            return
        }

        if (editingSkill) {
            setSkills((currentSkills) =>
                currentSkills.map((skill) =>
                    skill.id === editingSkill.id
                        ? {
                            ...skill,
                            name: form.name.trim(),
                            category: form.category,
                            level: form.level
                        }
                        : skill
                )
            )
        } else {
            setSkills((currentSkills) => [
                ...currentSkills,
                {
                    id: Date.now(),
                    name: form.name.trim(),
                    category: form.category,
                    level: form.level
                }
            ])
        }

        closeForm()
    }

    function deleteSkill(id) {
        setSkills((currentSkills) =>
            currentSkills.filter(
                (skill) => skill.id !== id
            )
        )
    }

    function getLevelPercentage(level) {
        const percentages = {
            Beginner: 25,
            Intermediate: 50,
            Advanced: 75,
            Expert: 100
        }

        return percentages[level]
    }

    return (
        <div className="manage-skills-page">

            <section className="page-intro">

                <div>
                    <span className="section-label">
                        Career tool
                    </span>

                    <h2>
                        Manage Skills
                    </h2>

                    <p>
                        Add and organize the skills that
                        represent your experience and
                        professional strengths.
                    </p>
                </div>

                <button
                    type="button"
                    className="skills-add-button"
                    onClick={openAddForm}
                >
                    <Plus size={18} />
                    Add Skill
                </button>

            </section>


            <section className="skills-summary">

                <div className="skills-summary-card">
                    <span>
                        Total Skills
                    </span>

                    <strong>
                        {skills.length}
                    </strong>
                </div>

                <div className="skills-summary-card">
                    <span>
                        Advanced
                    </span>

                    <strong>
                        {
                            skills.filter(
                                (skill) =>
                                    skill.level ===
                                    "Advanced"
                            ).length
                        }
                    </strong>
                </div>

                <div className="skills-summary-card">
                    <span>
                        Expert
                    </span>

                    <strong>
                        {
                            skills.filter(
                                (skill) =>
                                    skill.level ===
                                    "Expert"
                            ).length
                        }
                    </strong>
                </div>

            </section>


            <section className="skills-content-card">

                <div className="skills-toolbar">

                    <div className="skills-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(event) =>
                            setCategoryFilter(
                                event.target.value
                            )
                        }
                        className="skills-category-filter"
                    >
                        <option value="All">
                            All categories
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        )}
                    </select>

                </div>


                {filteredSkills.length === 0 ? (

                    <div className="skills-empty-state">

                        <div className="skills-empty-icon">
                            <Code2 size={24} />
                        </div>

                        <h3>
                            No skills found
                        </h3>

                        <p>
                            Add a skill or change your
                            search filters.
                        </p>

                    </div>

                ) : (

                    <div className="skills-list">

                        {filteredSkills.map(
                            (skill) => {

                                const Icon =
                                    categoryIcons[
                                    skill.category
                                    ] || Code2

                                const percentage =
                                    getLevelPercentage(
                                        skill.level
                                    )

                                return (
                                    <div
                                        className="skill-item"
                                        key={skill.id}
                                    >

                                        <div className="skill-main">

                                            <div className="skill-icon">
                                                <Icon
                                                    size={20}
                                                />
                                            </div>

                                            <div className="skill-information">

                                                <div className="skill-title-row">

                                                    <h3>
                                                        {
                                                            skill.name
                                                        }
                                                    </h3>

                                                    <span className="skill-category">
                                                        {
                                                            skill.category
                                                        }
                                                    </span>

                                                </div>

                                                <div className="skill-level-row">

                                                    <span>
                                                        {
                                                            skill.level
                                                        }
                                                    </span>

                                                    <div className="skill-progress">
                                                        <div
                                                            className="skill-progress-fill"
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                        />
                                                    </div>

                                                    <span>
                                                        {
                                                            percentage
                                                        }
                                                        %
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="skill-actions">

                                            <button
                                                type="button"
                                                className="skill-edit-button"
                                                onClick={() =>
                                                    openEditForm(
                                                        skill
                                                    )
                                                }
                                                aria-label={`Edit ${skill.name}`}
                                            >
                                                <Pencil
                                                    size={17}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="skill-delete-button"
                                                onClick={() =>
                                                    deleteSkill(
                                                        skill.id
                                                    )
                                                }
                                                aria-label={`Delete ${skill.name}`}
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>

                                        </div>

                                    </div>
                                )
                            }
                        )}

                    </div>

                )}

            </section>


            {showForm && (

                <div className="skill-modal-overlay">

                    <div className="skill-modal">

                        <div className="skill-modal-header">

                            <div>
                                <span className="section-label">
                                    Career tool
                                </span>

                                <h3>
                                    {editingSkill
                                        ? "Edit Skill"
                                        : "Add Skill"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                className="skill-modal-close"
                                onClick={closeForm}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="skill-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="skill-form-group">

                                <label htmlFor="skill-name">
                                    Skill Name
                                </label>

                                <input
                                    id="skill-name"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. React"
                                    autoFocus
                                />

                            </div>


                            <div className="skill-form-row">

                                <div className="skill-form-group">

                                    <label htmlFor="skill-category">
                                        Category
                                    </label>

                                    <select
                                        id="skill-category"
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        {categories.map(
                                            (
                                                category
                                            ) => (
                                                <option
                                                    key={
                                                        category
                                                    }
                                                    value={
                                                        category
                                                    }
                                                >
                                                    {
                                                        category
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>


                                <div className="skill-form-group">

                                    <label htmlFor="skill-level">
                                        Proficiency
                                    </label>

                                    <select
                                        id="skill-level"
                                        name="level"
                                        value={
                                            form.level
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        {levels.map(
                                            (level) => (
                                                <option
                                                    key={
                                                        level
                                                    }
                                                    value={
                                                        level
                                                    }
                                                >
                                                    {level}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>

                            </div>


                            <div className="skill-form-actions">

                                <button
                                    type="button"
                                    className="skill-cancel-button"
                                    onClick={
                                        closeForm
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="skill-save-button"
                                >
                                    {editingSkill
                                        ? "Save Changes"
                                        : "Add Skill"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    )
}

export default ManageSkills

