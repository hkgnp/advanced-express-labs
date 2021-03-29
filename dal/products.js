// import the Product model
const { Product, Category, Tag } = require('../models');

const getAllCategories = async () => {
  const fetchCategories = await Category.fetchAll();
  const allCategories = fetchCategories.map((category) => {
    return [category.get('id'), category.get('name')];
  });
  return allCategories;
};

const getAllTags = async () => {
  const fetchTags = await Tag.fetchAll();
  const allTags = fetchTags.map((tag) => {
    return [tag.get('id'), tag.get('name')];
  });
  return allTags;
};

module.exports = { getAllCategories, getAllTags };
