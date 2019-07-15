const wsboot = require('../index');

wsboot.init();

wsboot.get('/', (req, res) => res.json({ this: 'that' }));
