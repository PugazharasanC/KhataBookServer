import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js"; // Assuming you have a User model for DB
import dotenv from "dotenv";
dotenv.config();

// Serialize the user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Return the user if found
  } catch (err) {
    done(err, null); // If there's an error, pass the error to the done callback
  }
});

// Google OAuth strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`, // The callback URL after successful login
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Check if the user already exists in the database by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If the user does not exist, create a new user
        if (!user) {
          // Extracting email and profile picture safely
          const email =
            profile.emails && profile.emails[0] ? profile.emails[0].value : "";
          const profilePicture =
            profile.photos && profile.photos[0] ? profile.photos[0].value : "";

          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            profilePicture: profilePicture,
          });

          // Save the new user to the database
          await user.save();
        }

        // Return the user object to be stored in the session
        return done(null, user);
      } catch (error) {
        return done(error, null); // In case of an error, pass the error to the done callback
      }
    }
  )
);
