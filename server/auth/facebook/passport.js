import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';

export function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails'
    ]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    if (!profile.emails) {
      profile.emails = [{}];
      if (profile._json.email) profile.emails[0].value=profile._json.email;
      else profile.emails[0].value="";
    }
    User.find({where:{
      'facebook.id': profile.id }
    })
      .then(user => {
        if (user) {
          return done(null, user);
        }
        
        user = User.build({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json
        });
        user.save()
          .then(user => done(null, user))
          .catch(err => done());
      })
      .catch(err => done(err));
  }));
}
