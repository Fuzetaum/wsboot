const wsboot = require('../index');

wsboot.init();

wsboot.get('/', (_, res) => res.json({ this: 'that' }));
wsboot.post('/', (req, res) => res.json(req.body));
