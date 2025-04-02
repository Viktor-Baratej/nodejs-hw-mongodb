import User from '../../models/User.js';


export const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails[0].value;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: profile.displayName,
      password: null,
      googleId: profile.id,
    });
  }

  return user;
};
