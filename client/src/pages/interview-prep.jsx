
import { useEffect, useRef, useState } from "react"
import {
    BriefcaseBusiness,
    Code2,
    MessageSquare,
    ChevronRight,
    Clock3,
    Target,
    ArrowLeft,
    Volume2,
    Mic,
    Square,
    Trash2
} from "lucide-react"

function InterviewPrep() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [practiceStarted, setPracticeStarted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)

    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [audioUrl, setAudioUrl] = useState(null)

    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const timerRef = useRef(null)

    const categories = [
        {
            id: "behavioral",
            title: "Behavioral Interview",
            description:
                "Practice common questions about your experience, teamwork, problem solving, and career goals.",
            icon: MessageSquare,
            questions: 12,
            level: "All levels"
        },
        {
            id: "technical",
            title: "Technical Interview",
            description:
                "Prepare for technical questions related to web development, programming, and software engineering.",
            icon: Code2,
            questions: 15,
            level: "Intermediate"
        },
        {
            id: "frontend",
            title: "Frontend Developer",
            description:
                "Practice HTML, CSS, JavaScript, React, responsive design, and frontend development questions.",
            icon: BriefcaseBusiness,
            questions: 20,
            level: "Intermediate"
        }
    ]

    const questions = {
        behavioral: [
            "Tell me about yourself.",
            "Tell me about a challenging project you worked on.",
            "Describe a time you solved a difficult problem.",
            "How do you handle working under pressure?",
            "Tell me about a time you worked as part of a team."
        ],

        technical: [
            "What is the difference between let, const, and var in JavaScript?",
            "What is a REST API?",
            "What is the difference between frontend and backend development?",
            "What is a database and why is it used?",
            "What is the purpose of Git and GitHub?"
        ],

        frontend: [
            "What is the difference between HTML, CSS, and JavaScript?",
            "What is React and why is it used?",
            "What is a React component?",
            "What is the difference between props and state in React?",
            "How do you make a website responsive?"
        ]
    }

    const selectedQuestions =
        selectedCategory
            ? questions[selectedCategory]
            : []

    const currentQuestionText =
        selectedQuestions[currentQuestion] || ""

    function startPractice() {
        setCurrentQuestion(0)
        setPracticeStarted(true)
        clearRecording()
    }

    function goBackToPreparation() {
        stopRecording()
        clearRecording()

        setPracticeStarted(false)
        setCurrentQuestion(0)

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel()
        }
    }

    function nextQuestion() {
        clearRecording()

        if (currentQuestion < selectedQuestions.length - 1) {
            setCurrentQuestion(
                (current) => current + 1
            )
        }
    }

    function previousQuestion() {
        clearRecording()

        if (currentQuestion > 0) {
            setCurrentQuestion(
                (current) => current - 1
            )
        }
    }

    function listenToQuestion() {
        if (!currentQuestionText) {
            return
        }

        if (!("speechSynthesis" in window)) {
            alert(
                "Text-to-speech is not supported in this browser."
            )
            return
        }

        window.speechSynthesis.cancel()

        const speech =
            new SpeechSynthesisUtterance(
                currentQuestionText
            )

        speech.lang = "en-US"
        speech.rate = 0.85
        speech.pitch = 1
        speech.volume = 1

        speech.onstart = () => {
            console.log("Reading question...")
        }

        speech.onerror = (event) => {
            console.error(
                "Speech error:",
                event
            )

            alert(
                "The browser could not read the question. Please check your sound settings."
            )
        }

        window.speechSynthesis.speak(speech)
    }

    async function startRecording() {
        try {
            if (!navigator.mediaDevices) {
                alert(
                    "Your browser does not support microphone access."
                )
                return
            }

            if (!navigator.mediaDevices.getUserMedia) {
                alert(
                    "Microphone access is not available in this browser."
                )
                return
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                })

            const recorder =
                new MediaRecorder(stream)

            mediaRecorderRef.current = recorder
            audioChunksRef.current = []

            recorder.ondataavailable = (
                event
            ) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(
                        event.data
                    )
                }
            }

            recorder.onstop = () => {
                const audioBlob =
                    new Blob(
                        audioChunksRef.current,
                        {
                            type:
                                recorder.mimeType ||
                                "audio/webm"
                        }
                    )

                const url =
                    URL.createObjectURL(
                        audioBlob
                    )

                setAudioUrl(url)

                stream
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    )
            }

            recorder.start()

            setIsRecording(true)
            setRecordingTime(0)

            timerRef.current =
                setInterval(() => {
                    setRecordingTime(
                        (time) => time + 1
                    )
                }, 1000)

        } catch (error) {
            console.error(
                "Microphone access error:",
                error
            )

            if (
                error.name ===
                "NotAllowedError"
            ) {
                alert(
                    "Microphone permission was denied. Click the microphone icon in your browser's address bar and allow microphone access."
                )
            } else if (
                error.name ===
                "NotFoundError"
            ) {
                alert(
                    "No microphone was found on this device."
                )
            } else {
                alert(
                    "Could not start recording. Please check your microphone and try again."
                )
            }
        }
    }

    function stopRecording() {
        const recorder =
            mediaRecorderRef.current

        if (
            recorder &&
            recorder.state !== "inactive"
        ) {
            recorder.stop()
        }

        setIsRecording(false)

        if (timerRef.current) {
            clearInterval(
                timerRef.current
            )

            timerRef.current = null
        }
    }

    function clearRecording() {
        const recorder =
            mediaRecorderRef.current

        if (
            recorder &&
            recorder.state !== "inactive"
        ) {
            recorder.stop()
        }

        setIsRecording(false)
        setRecordingTime(0)

        if (timerRef.current) {
            clearInterval(
                timerRef.current
            )

            timerRef.current = null
        }

        if (audioUrl) {
            URL.revokeObjectURL(
                audioUrl
            )
        }

        setAudioUrl(null)
        audioChunksRef.current = []
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(
                    timerRef.current
                )
            }

            if (audioUrl) {
                URL.revokeObjectURL(
                    audioUrl
                )
            }

            if (
                "speechSynthesis" in window
            ) {
                window.speechSynthesis.cancel()
            }
        }
    }, [audioUrl])

    function formatRecordingTime() {
        const minutes =
            Math.floor(
                recordingTime / 60
            )

        const seconds =
            recordingTime % 60

        return `${String(
            minutes
        ).padStart(2, "0")
            }:${String(
                seconds
            ).padStart(2, "0")
            } `
    }

    if (practiceStarted) {
        const progress =
            ((currentQuestion + 1) /
                selectedQuestions.length) *
            100

        return (
            <div className="interview-prep-page">

                <div className="interview-practice-header">

                    <button
                        type="button"
                        className="interview-back-button"
                        onClick={
                            goBackToPreparation
                        }
                    >
                        <ArrowLeft
                            size={18}
                        />

                        Back to Preparation
                    </button>

                    <div className="interview-practice-progress">

                        <div>
                            <span>
                                Question{" "}
                                {currentQuestion +
                                    1}{" "}
                                of{" "}
                                {
                                    selectedQuestions.length
                                }
                            </span>

                            <strong>
                                {Math.round(
                                    progress
                                )}
                                %
                            </strong>
                        </div>

                        <div className="interview-practice-progress-bar">

                            <div
                                style={{
                                    width: `${progress}% `
                                }}
                            />

                        </div>

                    </div>

                </div>

                <section className="interview-practice-card">

                    <span className="page-eyebrow">
                        {selectedCategory ===
                            "behavioral"
                            ? "Behavioral Interview"
                            : selectedCategory ===
                                "technical"
                                ? "Technical Interview"
                                : "Frontend Developer"}
                    </span>

                    <h2>
                        Practice Question
                    </h2>

                    <div className="interview-practice-question">

                        <span>
                            Question{" "}
                            {currentQuestion +
                                1}
                        </span>

                        <h3>
                            {
                                currentQuestionText
                            }
                        </h3>

                    </div>

                    <div className="question-listen-area">

                        <button
                            type="button"
                            className="listen-question-button"
                            onClick={
                                listenToQuestion
                            }
                        >
                            <Volume2
                                size={18}
                            />

                            Listen to Question
                        </button>

                    </div>

                    <div className="voice-practice-section">

                        <div className="voice-practice-heading">

                            <div>
                                <h4>
                                    Practice your
                                    answer
                                </h4>

                                <p>
                                    Record your answer
                                    and listen to it
                                    before moving to
                                    the next question.
                                </p>
                            </div>

                            {isRecording && (
                                <div className="recording-timer">

                                    <span className="recording-dot"></span>

                                    {
                                        formatRecordingTime()
                                    }

                                </div>
                            )}

                        </div>

                        {!isRecording &&
                            !audioUrl && (
                                <div className="voice-practice-empty">

                                    <div className="voice-microphone-icon">
                                        <Mic
                                            size={28}
                                        />
                                    </div>

                                    <h4>
                                        Ready to answer?
                                    </h4>

                                    <p>
                                        Click the button
                                        below and speak
                                        naturally.
                                    </p>

                                    <button
                                        type="button"
                                        className="start-recording-button"
                                        onClick={
                                            startRecording
                                        }
                                    >
                                        <Mic
                                            size={18}
                                        />

                                        Start Recording
                                    </button>

                                </div>
                            )}

                        {isRecording && (
                            <div className="voice-recording-active">

                                <div className="recording-visual">

                                    <span className="recording-wave"></span>
                                    <span className="recording-wave"></span>
                                    <span className="recording-wave"></span>
                                    <span className="recording-wave"></span>
                                    <span className="recording-wave"></span>

                                </div>

                                <p>
                                    Recording your
                                    answer...
                                </p>

                                <button
                                    type="button"
                                    className="stop-recording-button"
                                    onClick={
                                        stopRecording
                                    }
                                >
                                    <Square
                                        size={16}
                                    />

                                    Stop Recording
                                </button>

                            </div>
                        )}

                        {!isRecording &&
                            audioUrl && (
                                <div className="recording-result">

                                    <div className="recording-result-header">

                                        <div>
                                            <strong>
                                                Your
                                                recording
                                            </strong>

                                            <span>
                                                {
                                                    formatRecordingTime()
                                                }
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="delete-recording-button"
                                            onClick={
                                                clearRecording
                                            }
                                            aria-label="Delete recording"
                                        >
                                            <Trash2
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                    </div>

                                    <audio
                                        className="recorded-audio"
                                        controls
                                        src={
                                            audioUrl
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="record-again-button"
                                        onClick={
                                            clearRecording
                                        }
                                    >
                                        <Mic
                                            size={17}
                                        />

                                        Record Again
                                    </button>

                                </div>
                            )}

                    </div>

                    <div className="interview-practice-actions">

                        <button
                            type="button"
                            className="practice-secondary-button"
                            onClick={
                                previousQuestion
                            }
                            disabled={
                                currentQuestion ===
                                0
                            }
                        >
                            Previous
                        </button>

                        {currentQuestion <
                            selectedQuestions.length -
                            1 ? (
                            <button
                                type="button"
                                className="practice-primary-button"
                                onClick={
                                    nextQuestion
                                }
                            >
                                Next Question

                                <ChevronRight
                                    size={18}
                                />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="practice-primary-button"
                                onClick={
                                    goBackToPreparation
                                }
                            >
                                Finish Practice
                            </button>
                        )}

                    </div>

                </section>

            </div>
        )
    }

    return (
        <div className="interview-prep-page">

            <div className="interview-prep-header">

                <div>
                    <span className="page-eyebrow">
                        Career Tools
                    </span>

                    <h2>
                        Interview Preparation
                    </h2>

                    <p>
                        Practice interview questions,
                        improve your answers, and prepare
                        with confidence for your next
                        opportunity.
                    </p>
                </div>

                <div className="interview-prep-progress">

                    <div className="interview-prep-progress-icon">
                        <Target
                            size={22}
                        />
                    </div>

                    <div>
                        <span>
                            Preparation progress
                        </span>

                        <strong>
                            0%
                        </strong>
                    </div>

                </div>

            </div>

            <section className="interview-prep-overview">

                <div className="interview-prep-overview-card">

                    <div className="interview-prep-overview-icon">
                        <Target
                            size={20}
                        />
                    </div>

                    <div>
                        <strong>
                            0
                        </strong>

                        <span>
                            Questions practiced
                        </span>
                    </div>

                </div>

                <div className="interview-prep-overview-card">

                    <div className="interview-prep-overview-icon">
                        <Clock3
                            size={20}
                        />
                    </div>

                    <div>
                        <strong>
                            0 min
                        </strong>

                        <span>
                            Practice time
                        </span>
                    </div>

                </div>

                <div className="interview-prep-overview-card">

                    <div className="interview-prep-overview-icon">
                        <BriefcaseBusiness
                            size={20}
                        />
                    </div>

                    <div>
                        <strong>
                            0
                        </strong>

                        <span>
                            Sessions completed
                        </span>
                    </div>

                </div>

            </section>

            <section className="interview-prep-section">

                <div className="interview-prep-section-heading">

                    <div>
                        <h3>
                            Choose your preparation
                        </h3>

                        <p>
                            Select an interview type to
                            start practicing.
                        </p>
                    </div>

                </div>

                <div className="interview-prep-category-grid">

                    {categories.map(
                        (category) => {

                            const Icon =
                                category.icon

                            const isSelected =
                                selectedCategory ===
                                category.id

                            return (
                                <button
                                    type="button"
                                    key={
                                        category.id
                                    }
                                    className={`interview - prep - category - card ${isSelected
                                            ? "selected"
                                            : ""
                                        } `}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category.id
                                        )
                                    }
                                >

                                    <div className="interview-prep-category-top">

                                        <div className="interview-prep-category-icon">
                                            <Icon
                                                size={
                                                    22
                                                }
                                            />
                                        </div>

                                        <ChevronRight
                                            size={
                                                20
                                            }
                                            className="interview-prep-category-arrow"
                                        />

                                    </div>

                                    <div className="interview-prep-category-content">

                                        <h4>
                                            {
                                                category.title
                                            }
                                        </h4>

                                        <p>
                                            {
                                                category.description
                                            }
                                        </p>

                                    </div>

                                    <div className="interview-prep-category-meta">

                                        <span>
                                            {
                                                category.questions
                                            }{" "}
                                            questions
                                        </span>

                                        <span>
                                            {
                                                category.level
                                            }
                                        </span>

                                    </div>

                                </button>
                            )
                        }
                    )}

                </div>

            </section>

            {selectedCategory && (
                <section className="interview-prep-start-card">

                    <div>

                        <span>
                            Ready to practice?
                        </span>

                        <h3>
                            Start your interview
                            preparation
                        </h3>

                        <p>
                            Your practice session will
                            show questions one at a time
                            so you can focus on each
                            answer.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="interview-prep-start-button"
                        onClick={
                            startPractice
                        }
                    >
                        Start Practice

                        <ChevronRight
                            size={18}
                        />
                    </button>

                </section>
            )}

        </div>
    )
}

export default InterviewPrep
