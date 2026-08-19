import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import * as db from "../database/queries.js";

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.getUserByUsername(username);
        if(!user){
            return done(null, false, { message: "Incorrect Username" });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return done(null, false, { message: "Incorrect Password" });
        }
        return done(null,user);
    } catch (error) {
        return done(error, false);
    }
}));

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async(jwtPayload, done) => {
    try {
        const user = await db.getUserById(jwtPayload.id);

        if(!user){
            return done(null,false);
        }

        return done(null,user);
    } catch (error) {
        return done(error, false);
    }
}));

// TODO: revisit if the time permits.
// passport.use(new GitHubStrategy({

//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/github/callback"
// },
// async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await db.getUserByGithubId(profile.id);

//         if(!user){
//             user = await db.createUserFromGithub({
//                 githubId: profile.id,
//                 username: profile.username,
//                 name: profile.displayName || profile.username,
//                 avatar: profile.photos?.[0]?.value ?? null,
//             });
//         }

//         return done(null, user);
//     } catch (error) {
//         return done(error, false);
//     }
// }));