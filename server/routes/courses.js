const express = require('express');
const { courses } = require('../data/seedData');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, courses });
});

router.get('/:id', (req, res) => {
    const course = courses.find((item) => item.id === req.params.id);
    if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ success: true, course });
});

router.post('/', requireAuth, (req, res) => {
    const { title, description, category, level, instructor } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newCourse = {
        id: `course-${Date.now()}`,
        title,
        description,
        category: category || 'General',
        level: level || 'Beginner',
        instructor: instructor || 'SkillBridge Team',
        duration: '4 weeks',
        skills: ['Learning'],
        lessons: 6,
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    };

    courses.push(newCourse);
    return res.status(201).json({ success: true, course: newCourse });
});

module.exports = router;
