const errorHandler = (err, req, res, next) => {
    err.statusCode = err.status || 500;
    err.status = err.status || 'error';

    if (process.env.NODE.ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
        return;
    } else {
        res.status(err.statusCode).json({
            status: status,
            message: err.message
        });
        return;
    }
};

module.exports = errorHandler;