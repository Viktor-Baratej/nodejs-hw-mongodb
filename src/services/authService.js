import User from '../models/user.js';
// export const findOrCreateGoogleUser = async (profile) => {
//   const email = profile.emails[0].value;

//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({
//       email,
//       name: profile.displayName,
//       password: null,
//       googleId: profile.id,
//     });
//   }

//   return user;
// };


export async function findOrCreateGoogleUser(profile) {
  // Пошук користувача за email або id
  const existingUser = await User.findOne({ email: profile.emails[0].value });

  if (existingUser) {
    // Якщо користувач знайдений, повертаємо його
    return existingUser;
  }

  // Якщо користувач не знайдений, створюємо нового
  const newUser = new User({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos[0].value,
  });

  await newUser.save();
  return newUser;
}
