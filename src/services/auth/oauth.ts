import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import User from "../../sql/UserModel"

import { authenticateUser } from "./GenerateToken"

const googleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_ID || "",
    clientSecret: process.env.GOOGLE_SECRET || "",
    callbackURL: `${process.env.BE_URL}/user/googleRedirect`,
    passReqToCallback: true,
  },
  async function (request, accessToken, refresh, profile, done) {
    try {
      if (profile.emails && profile.emails.length > 0) {
        const user = await User.findOne({
          where: { email: profile.emails[0].value },
        })

        if (user) {
          const token = await authenticateUser(user)
          done(null, { id: user.id, token, role: user.role })
        } else {
          const newUser = await User.create({
            firstName: profile.name?.givenName ?? "",
            lastName: profile.name?.familyName ?? "",
            email: profile.emails[0].value,
            googleId: profile.id,
            password: "",
          })

          const token = await authenticateUser(newUser)

          done(null, { id: newUser.id, token, role: newUser.role })
        }
      }
    } catch (error: any) {
      done(error)
    }
  }
)

passport.serializeUser((data, done) => {
  done(null, data)
})

passport.use("google", googleStrategy)
