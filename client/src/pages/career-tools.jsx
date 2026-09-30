import {
    FileText,
    MessageSquare,
    UserRound,
    Target,
    BriefcaseBusiness,
    ArrowRight,
    Wrench
} from "lucide-react"

import { useNavigate } from "react-router-dom"

function CareerTools() {
    const navigate = useNavigate()

    const tools = [
        {
            title: "Resume Builder",
            description:
                "Create and organize professional resumes tailored to your career goals.",
            icon: FileText,
            action: "Open Resume Builder",
            path: "/career-tools/resume"
        },
        {
            title: "Interview Preparation",
            description:
                "Prepare for interviews with questions, notes, and structured practice.",
            icon: MessageSquare,
            action: "Start Preparing",
            path: "/career-tools/interview-prep"
        },
        {
            title: "Career Profile",
            description:
                "Build a complete professional profile with your experience, skills, and links.",
            icon: UserRound,
            action: "Manage Profile",
            path: "/profile"
        },


        {
            title: "Skills & Goals",
            description:
                "Track the skills you want to develop and set clear career goals.",
            icon: Target,
            action: "Manage Skills",
            path: "/career-tools/manage-skills"
        },

        {
            title: "Portfolio Builder",
            description:
                "Organize your projects and create a stronger professional portfolio.",
            icon: BriefcaseBusiness,
            action: "Build Portfolio",
            path: "/career-tools/portfolio"
        }
    ]

    return (
        <div className="career-tools-page">

            <section className="career-tools-intro">
                <div className="career-tools-title-row">

                    <div className="career-tools-page-icon">
                        <Wrench size={20} />
                    </div>

                    <div>
                        <h1>Career Tools</h1>
                        <p>
                            Build your resume, prepare for interviews,
                            and manage your career profile.
                        </p>
                    </div>

                </div>
            </section>

            <section className="career-tools-grid">

                {tools.map((tool) => {
                    const Icon = tool.icon

                    return (
                        <article
                            className="career-tool-card"
                            key={tool.title}
                        >
                            <div className="career-tool-icon">
                                <Icon size={21} />
                            </div>

                            <div className="career-tool-content">
                                <h2>{tool.title}</h2>

                                <p>{tool.description}</p>

                                <button
                                    type="button"
                                    className="career-tool-button"
                                    onClick={() => navigate(tool.path)}
                                >
                                    <span>{tool.action}</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </article>
                    )
                })}

            </section>

            <section className="career-tools-tip">

                <div className="career-tools-tip-icon">
                    <Target size={18} />
                </div>

                <div>
                    <h3>Build your career step by step</h3>
                    <p>
                        Keep your resume, skills, interview preparation,
                        and portfolio organized in one place.
                    </p>
                </div>

            </section>

        </div>
    )
}

export default CareerTools