const express = require('express');
const router = express.Router();

// import the Product model
const { Product } = require('../models');

// import the forms
const { createProductForm, bootstrapField } = require('../forms');

router.get('/', async (req, res) => {
  // Select * fro Products

  let products = await Product.collection().fetch();

  res.render('products/index', {
    products: products.toJSON(),
  });
});

router.get('/create', (req, res) => {
  const productForm = createProductForm();

  res.render('products/create', {
    form: productForm.toHTML(bootstrapField),
  });
});

router.post('/create', (req, res) => {
  const productForm = createProductForm();
  productForm.handle(req, {
    success: async (form) => {
      // Use the product moodel to save a new instance of Product
      const newProduct = new Product();
      newProduct.set('title', form.data.title);
      newProduct.set('cost', form.data.cost);
      newProduct.set('description', form.data.description);
      newProduct.set('date', form.data.date);
      newProduct.set('stock', form.data.stock);
      newProduct.set('height', form.data.height);
      newProduct.set('width', form.data.width);
      await newProduct.save();
      res.redirect('/products');
    },
    error: (form) => {
      res.render('products/create', {
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

router.get('/:product_id/update', async (req, res) => {
  //1. Get the product that we want to update
  const productToEdit = await Product.where({
    id: req.params.product_id,
  }).fetch({
    required: true,
  });

  const form = createProductForm();
  form.fields.title.value = productToEdit.get('title');
  form.fields.cost.value = productToEdit.get('cost');
  form.fields.description.value = productToEdit.get('description');
  form.fields.date.value = productToEdit.get('date');
  form.fields.stock.value = productToEdit.get('stock');
  form.fields.height.value = productToEdit.get('height');
  form.fields.width.value = productToEdit.get('width');

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
  });

  const productForm = createProductForm();

  productForm.handle(req, {
    success: async (form) => {
      productToEdit.set(form.data);
      productToEdit.save();
      res.redirect('/products');
    },
    error: async (form) => {
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
  res.redirect('/products');
});
module.exports = router;
