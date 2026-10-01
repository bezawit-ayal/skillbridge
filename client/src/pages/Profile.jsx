import { useEffect, useRef, useState } from "react"
import { useProfile } from "../context/profile-context"
import {
    User,
    Mail,
    MapPin,
    Briefcase,
    GraduationCap,
    Code2,
    Github,
    Linkedin,
    Globe,
    Pencil,
    Save,
    Camera
} from "lucide-react"

function Profile() {
    const { profile, setProfile, saveProfile, loading, error } = useProfile()
    const fileInputRef = useRef(null)

    const [isEditing, setIsEditing] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!loading) {
            setIsEditing(
                !profile.headline && !profile.bio &&
                !profile.experience && !profile.education
            )
        }
    }, [loading])

    const profileFields = [
        "name",
        "email",
        "location",
        "headline",
        "bio",
        "experience",
        "education",
        "github",
        "linkedin",
        "portfolio"
    ]

    function handleChange(event) {
        const { name, value } = event.target

        setProfile((currentProfile) => ({
            ...currentProfile,
            [name]: value
        }))

        setSaved(false)
    }

    async function handleSave() {
        const wasSaved = await saveProfile(profile)
        if (!wasSaved) return

        setIsEditing(false)
        setSaved(true)

        setTimeout(() => {
            setSaved(false)
        }, 2500)
    }

    function handleEdit() {
        setIsEditing(true)
        setSaved(false)
    }

    function handleAvatarUpload(event) {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            event.target.value = ""
            setSaved(false)
            window.alert("Choose an image smaller than 5 MB.")
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            const image = new Image()
            image.onload = () => {
                const scale = Math.min(1, 512 / Math.max(image.width, image.height))
                const canvas = document.createElement("canvas")
                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)
                canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height)

                setProfile((currentProfile) => ({
                    ...currentProfile,
                    avatarUrl: canvas.toDataURL("image/jpeg", 0.78)
                }))
                setSaved(false)
            }
            image.src = reader.result
        }

        reader.readAsDataURL(file)
    }

    const completedFields = profileFields.filter(
        (field) => profile[field]?.trim()
    ).length

    const skillsCompleted = profile.skills.length > 0 ? 1 : 0

    const profileCompletion = Math.round(
        ((completedFields + skillsCompleted) /
            (profileFields.length + 1)) *
        100
    )

    return (
        <div className="profile-page">

            <section className="profile-header-card">

                <button
                    type="button"
                    className="profile-avatar-upload-button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload profile photo"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarUpload}
                    />

                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt={profile.name}
                            className="profile-avatar-image"
                        />
                    ) : (
                        <span className="profile-avatar-letter">
                            {profile.name.charAt(0).toUpperCase()}
                        </span>
                    )}

                    <span className="profile-avatar-camera">
                        <Camera size={12} />
                    </span>
                </button>

                <div className="profile-header-info">
                    <h1>{profile.name}</h1>

                    <p className="profile-headline">
                        {profile.headline}
                    </p>

                    <div className="profile-meta">

                        <span>
                            <Mail size={14} />
                            {profile.email}
                        </span>

                        <span>
                            <MapPin size={14} />
                            {profile.location}
                        </span>

                    </div>
                </div>

                <div className="profile-header-action">

                    {!isEditing ? (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={handleEdit}
                        >
                            <Pencil size={15} />
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={handleSave}
                        >
                            <Save size={15} />
                            Save Profile
                        </button>
                    )}

                </div>

            </section>

            <div className="profile-layout">

                <main className="profile-main">


                    <section className="profile-card">

                        <div className="profile-card-header">
                            <div>
                                <h2>Skills</h2>
                                <p>
                                    Technologies and professional skills.
                                </p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="profile-add-skill">

                                <input
                                    type="text"
                                    id="new-skill"
                                    placeholder="Add a skill..."
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            const input = event.currentTarget
                                            const skill = input.value.trim()

                                            if (
                                                skill &&
                                                !profile.skills.includes(skill)
                                            ) {
                                                setProfile((currentProfile) => ({
                                                    ...currentProfile,
                                                    skills: [
                                                        ...currentProfile.skills,
                                                        skill
                                                    ]
                                                }))

                                                input.value = ""
                                                setSaved(false)
                                            }
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        const input =
                                            document.getElementById("new-skill")

                                        const skill = input.value.trim()

                                        if (
                                            skill &&
                                            !profile.skills.includes(skill)
                                        ) {
                                            setProfile((currentProfile) => ({
                                                ...currentProfile,
                                                skills: [
                                                    ...currentProfile.skills,
                                                    skill
                                                ]
                                            }))

                                            input.value = ""
                                            setSaved(false)
                                        }
                                    }}
                                >
                                    Add Skill
                                </button>

                            </div>
                        )}

                        <div className="profile-skills">

                            {profile.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="profile-skill"
                                >
                                    <Code2 size={13} />

                                    {skill}

                                    {isEditing && (
                                        <button
                                            type="button"
                                            className="profile-remove-skill"
                                            onClick={() => {
                                                setProfile((currentProfile) => ({
                                                    ...currentProfile,
                                                    skills: currentProfile.skills.filter(
                                                        (currentSkill) =>
                                                            currentSkill !== skill
                                                    )
                                                }))

                                                setSaved(false)
                                            }}
                                            aria-label={`Remove ${skill}`}
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}

                        </div>

                    </section>


                    <section className="profile-card">

                        <div className="profile-card-header">
                            <div>
                                <h2>Experience & Education</h2>
                                <p>
                                    Your professional background.
                                </p>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="profile-form">
                                <div className="profile-form-group">

                                    <label>Name</label>

                                    <input
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">

                                    <label>Experience</label>
                                    <input
                                        name="experience"
                                        value={profile.experience}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Education</label>
                                    <input
                                        name="education"
                                        value={profile.education}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        ) : (
                            <div className="profile-info-grid">

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">
                                        <Briefcase size={17} />
                                    </div>

                                    <div>
                                        <span>Experience</span>
                                        <strong>
                                            {profile.experience}
                                        </strong>
                                    </div>

                                </div>

                                <div className="profile-info-item">

                                    <div className="profile-info-icon">
                                        <GraduationCap size={17} />
                                    </div>

                                    <div>
                                        <span>Education</span>
                                        <strong>
                                            {profile.education}
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        )}

                    </section>


                    <section className="profile-card">

                        <div className="profile-card-header">
                            <div>
                                <h2>Professional Links</h2>
                                <p>
                                    Connect your professional profiles.
                                </p>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="profile-form">

                                <div className="profile-form-group">
                                    <label>GitHub</label>
                                    <input
                                        name="github"
                                        placeholder="https://github.com/username"
                                        value={profile.github}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>LinkedIn</label>
                                    <input
                                        name="linkedin"
                                        placeholder="https://linkedin.com/in/username"
                                        value={profile.linkedin}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Portfolio</label>
                                    <input
                                        name="portfolio"
                                        placeholder="https://yourportfolio.com"
                                        value={profile.portfolio}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                        ) : (
                            <div className="profile-links">

                                {profile.github && (
                                    <a
                                        href={profile.github}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Github size={17} />
                                        GitHub
                                    </a>
                                )}

                                {profile.linkedin && (
                                    <a
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Linkedin size={17} />
                                        LinkedIn
                                    </a>
                                )}

                                {profile.portfolio && (
                                    <a
                                        href={profile.portfolio}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Globe size={17} />
                                        Portfolio
                                    </a>
                                )}

                                {!profile.github &&
                                    !profile.linkedin &&
                                    !profile.portfolio && (
                                        <p className="profile-empty-links">
                                            No professional links added yet.
                                        </p>
                                    )}

                            </div>
                        )}

                    </section>

                </main>

                <aside className="profile-sidebar">

                    <section className="profile-completion-card">

                        <div className="profile-completion-top">
                            <div>
                                <h2>Profile Completion</h2>
                                <p>
                                    Keep your profile updated.
                                </p>
                            </div>

                            <strong>
                                {profileCompletion}%
                            </strong>
                        </div>

                        <div className="profile-progress">
                            <span
                                style={{
                                    width: `${profileCompletion}%`
                                }}
                            />
                        </div>

                        <p className="profile-completion-message">
                            A complete profile helps you present your
                            experience clearly to employers.
                        </p>

                    </section>

                    <section className="profile-card profile-quick-card">

                        <div className="profile-card-header">
                            <div>
                                <h2>Career Profile</h2>
                                <p>
                                    Quick overview.
                                </p>
                            </div>
                        </div>

                        <div className="profile-quick-item">
                            <User size={16} />
                            <span>Professional Profile</span>
                        </div>

                        <div className="profile-quick-item">
                            <Code2 size={16} />
                            <span>
                                {profile.skills.length} Skills
                            </span>
                        </div>

                        <div className="profile-quick-item">
                            <Briefcase size={16} />
                            <span>
                                {profile.experience} Experience
                            </span>
                        </div>

                    </section>

                </aside>

            </div>

            {saved && (
                <div className="profile-save-message">
                    Profile saved successfully.
                </div>
            )}

            {error && <div className="app-error" role="alert">{error}</div>}

        </div>
    )
}

export default Profile