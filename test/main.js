const wsboot = require('../index');

wsboot.init();

wsboot.get('/test1', { paginated: true }, (_, res) => res.json({ obj1: { this: 'that'}  }));
wsboot.post('/test2', (req, res) => res.json(req.body));
