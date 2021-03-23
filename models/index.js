const bookshelf = require('../bookshelf');

// create model for products table
// first argument is the name of the model
// second argument is the config object
// in the example below, the Product model is using the products table
const Product = bookshelf.model('Product', {
  tableName: 'products',

  // ensure name of function is the same as the FK without the "_id"
  category() {
    // First argument is the name of the model
    return this.belongsTo('Category');
  },
});

const Category = bookshelf.model('Category', {
  tableName: 'categories',

  // ensure name of function is the same as the model but in lowercase and in plural
  products() {
    return this.hasMany('Product');
  },
});

module.exports = { Product, Category };
