import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
    const message = `Duplicate field value: "${value}". Please use another value!`;
    return new AppError(message, 400);
}

const sendError = (err, res) => {
    if(process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            type: err.type,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    else {
        if (err.isOperational) { // client
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else { // DEV :|
            console.error('ERROR: ', err); 
            res.status(500).json({
                status: 'error',
                message: 'Something went very bad!'
            });
        }
    }
}

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    sendError(err, res);

}

export default globalErrorHandler;

