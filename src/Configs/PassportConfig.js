import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../Models/User.js';

const PassportConfig = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/google/callback",
        passReqToCallback: true
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                // If user doesn't exist, create a new one
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName, // You may adjust this based on Google profile data
                        email: profile.emails[0].value // You may adjust this based on Google profile data
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default PassportConfig;