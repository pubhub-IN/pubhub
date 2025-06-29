const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub OAuth profile received:', {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value
    });

    // Here you would typically save the user to your database
    // For now, we'll just pass the profile data
    const user = {
      id: profile.id,
      username: profile.username,
      login: profile.username,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos,
      accessToken: accessToken,
      provider: 'github'
    };

    return done(null, user);
  } catch (error) {
    console.error('GitHub Strategy error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user:', id);
    // Here you would typically fetch the user from your database
    // For now, we'll create a mock user object
    const user = { id: id, login: 'github_user' };
    done(null, user);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

module.exports = passport;