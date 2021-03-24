const express = require('express');
const router = express.Router();

// import the Product model
const { Product, Category, Tag } = require('../models');

// import the forms
const { createProductForm, bootstrapField } = require('../forms');

router.get('/', async (req, res) => {
  // Select * fro Products

  let products = await Product.collection().fetch({
    withRelated: ['category', 'tags'],
  });

  // res.send(products);

  res.render('products/index', {
    products: products.toJSON(),
  });
});

router.get('/create', async (req, res) => {
  const fetchCategories = await Category.fetchAll();
  const allCategories = fetchCategories.map((category) => {
    return [category.get('id'), category.get('name')];
  });

  const fetchTags = await Tag.fetchAll();
  const allTags = fetchTags.map((tag) => {
    return [tag.get('id'), tag.get('name')];
  });

  const productForm = createProductForm(allCategories, allTags);

  res.render('products/create', {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post('/create', async (req, res) => {
  const fetchCategories = await Category.fetchAll();
  const allCategories = fetchCategories.map((category) => {
    return [category.get('id'), category.get('name')];
  });

  const fetchTags = await Tag.fetchAll();
  const allTags = fetchTags.map((tag) => {
    return [tag.get('id'), tag.get('name')];
  });

  const productForm = createProductForm(allCategories, allTags);
  productForm.handle(req, {
    success: async (form) => {
      let { tags, ...productData } = form.data;

      // Use the product moodel to save a new instance of Product
      const newProduct = new Product();
      newProduct.set(productData);
      // newProduct.set('cost', form.data.cost);
      // newProduct.set('description', form.data.description);
      // newProduct.set('date', form.data.date);
      // newProduct.set('stock', form.data.stock);
      // newProduct.set('height', form.data.height);
      // newProduct.set('width', form.data.width);
      // newProduct.set('category_id', form.data.category_id);
      await newProduct.save();

      if (tags) {
        await newProduct.tags().attach(tags.split(','));
      }

      // Inject flash message
      req.flash(
        'success_messages',
        'New product has been created successfully'
      );
      res.redirect('/products');
    },
    error: (form) => {
      // req.flash('error_messages', 'Please correct all errors and try again');
      res.render('products/create', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/:product_id/update', async (req, res) => {
  const fetchCategories = await Category.fetchAll();
  const allCategories = fetchCategories.map((category) => {
    return [category.get('id'), category.get('name')];
  });
  const fetchTags = await Tag.fetchAll();
  const allTags = fetchTags.map((tag) => {
    return [tag.get('id'), tag.get('name')];
  });

  //1. Get the product that we want to update
  const productToEdit = await Product.where({
    id: req.params.product_id,
  }).fetch({
    required: true,
    withRelated: ['category', 'tags'],
  });

  // Option 1
  // const selectedTags = await productToEdit.related('tags').pluck('id');

  // Option 2
  const selectedTags = productToEdit.toJSON().tags.map((t) => t.id);

  const form = createProductForm(allCategories, allTags);
  form.fields.title.value = productToEdit.get('title');
  form.fields.cost.value = productToEdit.get('cost');
  form.fields.description.value = productToEdit.get('description');
  form.fields.date.value = productToEdit.get('date');
  form.fields.stock.value = productToEdit.get('stock');
  form.fields.height.value = productToEdit.get('height');
  form.fields.width.value = productToEdit.get('width');
  form.fields.category_id.value = productToEdit.get('category_id');
  // Set selected tags to the form to be displayed
  form.fields.tags.value = selectedTags;

  res.render('products/update', {
    form: form.toHTML(bootstrapField),
    product: productToEdit.toJSON(),
  });
});

router.post('/:product_id/update', async (req, res) => {
  const productToEdit = await Product.where({
    id: req.params.product_id,
  }).fetch({
    required: true,
    withRelated: ['tags'],
  });

  // Option 1
  // const selectedTags = await productToEdit.related('tags').pluck('id');

  // Option 2
  const selectedTags = productToEdit.toJSON().tags.map((t) => t.id);
  const productForm = createProductForm();

  productForm.handle(req, {
    success: async (form) => {
      const { tags, ...productData } = form.data;
      productToEdit.set(productData);
      productToEdit.save();

      // Update tags
      const newTagsId = tags.split(',');

      // ultra-complex solution
      // // remove all the tags that don't belong to the product
      // // i.e, find all the tags that WERE part of the product but not in the form
      // let toRemove = existingTagsId.filter(id =>
      //     newTagsId.includes(id) === false);
      // await productToEdit.tags().detach(toRemove);

      // // add in all the tags selected in the form
      // // i.e select all the tags that are in the form but not added to the product yet
      // let toAdd = newTagsId.filter(id => existingTagsId.includes(id) === false);
      // await productToEdit.tags().attach(toAdd);

      // smart but not as efficient
      productToEdit.tags().detach(selectedTags);
      productToEdit.tags().attach(newTagsId);

      // Inject flash message
      req.flash('success_messages', 'Product has been updated successfully');

      res.redirect('/products');
    },
    error: (form) => {
      res.render('products/update', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/:product_id/delete', async (req, res) => {
  const productToDelete = await Product.where({
    id: req.params.product_id,
  }).fetch({
    required: true,
  });

  res.render('products/delete.hbs', {
    product: productToDelete.toJSON(),
  });
});

router.post('/:product_id/delete', async (req, res) => {
  const productToDelete = await Product.where({
    id: req.params.product_id,
  }).fetch({
    required: true,
  });

  await productToDelete.destroy();

  req.flash('success_messages', 'Product has been deleted successfully');
  res.redirect('/products');
});
module.exports = router;
