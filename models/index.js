const bookshelf = require('../bookshelf');

// create model for products table
// first argument is the name of the model
// second argument is the config object
// in the example below, the Product model is using the products table
const Product = bookshelf.model('Product', {
  tableName: 'products',
});

module.exports = {
  Product,
};
