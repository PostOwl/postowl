import { env } from '$env/dynamic/private'; 
const ADMIN_NAME = env.ADMIN_NAME;

export const DEFAULT_BIO = {
  avatar: '/images/person-placeholder.jpg',
  name: ADMIN_NAME,
  bio: '<p>Welcome to my PostOwl website!</p>'
};
