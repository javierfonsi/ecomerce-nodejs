//models

const { Product } = require("../models/products.model");
const { User } = require("../models/users.model");



const initModels = () => {
  // 1 User <----> M Reviews
  User.hasMany(Product);
  Product.belongsTo(User);

  //// 1 User <----> M Reviews
  //Movie.hasMany(Review);
  //Review.belongsTo(Movie);

  //// M Movie <--> M Actor
  //Movie.belongsToMany(Actor, { through: ActorsInMovie });
  //Actor.belongsToMany(Movie, { through: ActorsInMovie });

};

module.exports = { initModels };
