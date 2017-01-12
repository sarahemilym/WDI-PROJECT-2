module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost:27017/skiing-app',
  secret: process.env.SECRET || 'secret'
};
