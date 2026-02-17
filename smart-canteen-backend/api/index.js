const app = require('../server');

module.exports = (req, res) => {
    // Add support for Vercel Serverless Function entry point
    return app(req, res);
};
