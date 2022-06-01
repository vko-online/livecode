const dev = process.env.NODE_ENV !== 'production';

export const serverUrl = dev ? 'http://localhost:3000' : 'https://livecode-kz.herokuapp.com';
export const websocketUrl = dev ? 'http://localhost:3001' : 'https://livecode-kz.herokuapp.com:3001';