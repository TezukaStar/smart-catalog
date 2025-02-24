const redis = require('redis');
const client = redis.createClient();

// client.connect();

const cache = (duration) => {
    return async (req, res, next) => {
        const key = req.originalUrl;

        try {
            const cached = await client.get(key);
            if (cached) {
                res.status(200).json({
                    status: 'success',
                    data: JSON.parse(cached)
                });
                return;
            }
            res.sendResponse = res.json;
            res.json = (body) => {
                client.setEx(key, duration, JSON.stringify(body));
                res.sendResponse(body);
            }
            next();
            return;
        } catch (error) {
            next(error);
            return;
        }
    }
};

module.exports = cache;