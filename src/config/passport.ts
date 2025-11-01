import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { IUser, User } from "../models/User";

// LOCAL STRATEGY (email/password)
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return cb(null, false, { message: "User not found" });

      if (!user.password)
        return cb(null, false, { message: "Use Google login instead" });

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch
        ? cb(null, user)
        : cb(null, false, { message: "Incorrect password" });
    } catch (err) {
      return cb(err);
    }
  })
);

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            isParent: false,
          });
        }

        return cb(null, user);
      } catch (err) {
        cb(err);
      }
    }
  )
);

// SESSION HANDLING
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
export default passport;
