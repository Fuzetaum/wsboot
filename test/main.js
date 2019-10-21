const wsboot = require('../index');

wsboot.init();

wsboot.all('/testall', (_, res) => res.json({ method: 'all' }));

wsboot.get('/test', (req, res) => res.json({ ...req.query, method: 'get' }));
wsboot.delete('/test', (req, res) => res.json({ ...req.body, method: 'delete' }));
wsboot.patch('/test', (req, res) => res.json({ ...req.body, method: 'patch' }));
wsboot.post('/test', (req, res) => res.json({ ...req.body, method: 'post' }));
wsboot.put('/test', (req, res) => res.json({ ...req.body, method: 'put' }));
