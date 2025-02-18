
// Middleware to check if the user is authenticated
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // If user is authenticated, proceed to the next middleware or route handler
    return next();
  } else {
    // If user is not authenticated, redirect to login or an error page
    res.redirect(`/auth/google`); // Redirect to Google login page
  }
};
