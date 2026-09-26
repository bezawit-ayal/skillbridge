const bcrypt = require('bcryptjs');

const plans = [
    {
        id: 'free',
        name: 'Free',
        description: 'Core learning access with free courses and progress tracking.',
        price: 0,
        billingPeriod: 'month',
        features: ['Free courses', 'Basic quizzes', 'Progress tracking', 'Portfolio basics'],
        studentPrice: 0,
        womenProgramEligible: false,
        active: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        description: 'Advanced AI feedback, job-readiness tools, and premium support.',
        price: 29,
        billingPeriod: 'month',
        features: ['Advanced AI feedback', 'Mentor support', 'Premium project reviews', 'Career resources'],
        studentPrice: 19,
        womenProgramEligible: true,
        active: true,
    },
];

const courses = [
    {
        id: 'html-css',
        title: 'HTML & CSS',
        description: 'Learn semantic HTML, modern CSS layouts, responsive design, and visual polish.',
        category: 'Frontend',
        level: 'Beginner',
        instructor: 'Maya Thompson',
        duration: '4 weeks',
        skills: ['HTML', 'CSS', 'Responsive Design'],
        lessons: 8,
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
        modules: [
            { title: 'HTML Essentials', lessons: 3 },
            { title: 'CSS Layout & Design', lessons: 3 },
            { title: 'Responsive Web Design', lessons: 2 },
        ],
    },
    {
        id: 'javascript',
        title: 'JavaScript',
        description: 'Build interactive experiences with JavaScript fundamentals and DOM manipulation.',
        category: 'Frontend',
        level: 'Intermediate',
        instructor: 'Daniel Green',
        duration: '5 weeks',
        skills: ['JavaScript', 'DOM', 'Functions'],
        lessons: 10,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=900&q=80',
        modules: [
            { title: 'JS Foundations', lessons: 4 },
            { title: 'DOM & Events', lessons: 3 },
            { title: 'Logic & Data Flow', lessons: 3 },
        ],
    },
    {
        id: 'react',
        title: 'React',
        description: 'Create modern component-based interfaces with React and state-driven UI.',
        category: 'Frontend',
        level: 'Intermediate',
        instructor: 'Aisha Morgan',
        duration: '6 weeks',
        skills: ['React', 'Components', 'State'],
        lessons: 12,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80',
        modules: [
            { title: 'React Basics', lessons: 4 },
            { title: 'Hooks', lessons: 4 },
            { title: 'App Architecture', lessons: 4 },
        ],
    },
    {
        id: 'nodejs',
        title: 'Node.js',
        description: 'Build backend services, APIs, authentication, and server-side logic.',
        category: 'Backend',
        level: 'Intermediate',
        instructor: 'Alec Morgan',
        duration: '6 weeks',
        skills: ['Node.js', 'Express', 'API Design'],
        lessons: 10,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
        modules: [
            { title: 'Node Basics', lessons: 3 },
            { title: 'Express APIs', lessons: 4 },
            { title: 'Authentication', lessons: 3 },
        ],
    },
    {
        id: 'git',
        title: 'Git & GitHub',
        description: 'Manage code, collaborate with teams, and contribute professionally.',
        category: 'Tools',
        level: 'Beginner',
        instructor: 'Sara Kim',
        duration: '3 weeks',
        skills: ['Git', 'GitHub', 'Collaboration'],
        lessons: 7,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        modules: [
            { title: 'Git Basics', lessons: 3 },
            { title: 'Branching', lessons: 2 },
            { title: 'Pull Requests', lessons: 2 },
        ],
    },
];

const users = [
    {
        id: 'admin-1',
        name: 'SkillBridge Admin',
        email: 'admin@skillbridge.dev',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin',
        username: 'admin',
        interests: ['Technology', 'Mentorship'],
        subscription: 'premium',
        bio: 'Platform administrator and mentor support lead.',
        verification: { studentStatus: 'verified', womenStatus: 'approved' },
    },
    {
        id: 'mentor-1',
        name: 'Sarah Lee',
        email: 'mentor@skillbridge.dev',
        password: bcrypt.hashSync('password123', 10),
        role: 'mentor',
        username: 'sarahmentor',
        interests: ['React', 'Career Growth'],
        subscription: 'premium',
        bio: 'Frontend mentor and career coach.',
        verification: { studentStatus: 'not-applied', womenStatus: 'not-applied' },
    },
    {
        id: 'student-1',
        name: 'Amina Yusuf',
        email: 'student@skillbridge.dev',
        password: bcrypt.hashSync('password123', 10),
        role: 'student',
        username: 'aminay',
        interests: ['JavaScript', 'React', 'Full Stack'],
        subscription: 'premium',
        bio: 'Aspiring full-stack developer.',
        verification: { studentStatus: 'verified', womenStatus: 'approved' },
    },
];

const mentors = [
    {
        id: 'mentor-1',
        name: 'Sarah Lee',
        expertise: ['React', 'JavaScript', 'Career Coaching'],
        bio: 'Helps students build confident portfolios and prepare for job interviews.',
        availability: 'Available this week',
    },
    {
        id: 'mentor-2',
        name: 'Daniel Brooks',
        expertise: ['Node.js', 'Backend Systems', 'API design'],
        bio: 'Mentors developers building robust, scalable full-stack apps.',
        availability: 'Limited spots',
    },
];

const verifications = [
    {
        id: 'v-1',
        userId: 'student-1',
        type: 'student',
        status: 'approved',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin-1',
        rejectionReason: '',
        documentReference: 'private/student-1/student-id.pdf',
    },
];

const notifications = [
    { id: 'n-1', message: 'Course progress updated: JavaScript', read: false },
    { id: 'n-2', message: 'Verification approved', read: false },
];

module.exports = {
    users,
    courses,
    plans,
    mentors,
    verifications,
    notifications,
};
