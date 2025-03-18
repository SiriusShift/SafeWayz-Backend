const asyncHandler = (handler) => {
    return async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error); // Pass the error to the global error handler
      }
    };
  };
  
module.exports = asyncHandler;
  