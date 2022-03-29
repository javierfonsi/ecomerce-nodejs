// Models

const { Product } = require('../models/products.model');
const { User } = require('../models/users.model');


const initModels = () => {
  // 1 User <----> M Review
  User.hasMany(Product);
  Product.belongsTo(User);

  // 1 Movie <----> M Review
  // Movie.hasMany(Review);
  // Review.belongsTo(Movie);

  // M Movie <----> M Acotr
  // Movie.belongsToMany(Actor, { through: ActorInMovie });
  // Actor.belongsToMany(Movie, { through: ActorInMovie });
};

module.exports = { initModels };
