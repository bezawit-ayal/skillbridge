const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const projects = [
    {
        id: 'project-1',
        title: 'Portfolio Website',
        description: 'A responsive portfolio built with React and modern CSS.',
        technologies: ['React', 'CSS'],
        githubUrl: 'https://github.com/example/portfolio',
        liveDemoUrl: 'https://example.com',
        whatILearned: 'Improved design system thinking and reusable component patterns.',
    },
];

router.get('/', requireAuth, (req, res) => {
    res.json({ success: true, projects });
});

router.post('/', requireAuth, (req, res) => {
    const project = {
        id: `project-${Date.now()}`,
        ...req.body,
    };

    projects.push(project);
    res.status(201).json({ success: true, project });
});

router.put('/:id', requireAuth, (req, res) => {
    const index = projects.findIndex((project) => project.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    projects[index] = { ...projects[index], ...req.body };
    res.json({ success: true, project: projects[index] });
});

router.delete('/:id', requireAuth, (req, res) => {
    const index = projects.findIndex((project) => project.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Project not found.' });
    }

    projects.splice(index, 1);
    res.json({ success: true, message: 'Project deleted.' });
});

module.exports = router;
