const Category = require('../models/category');
const slugify = require('slugify');

function createCategories(categories, parentId = null) {
    let category;
    const categoryList = [];
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            type: cate.type,
            parentId: cate.parentId,
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList;
};

exports.viewCategories = (req, res) => {
    Category.find({})
        .exec((err, categories) => {
            if (err) return res.status(400).json({ message: "Something went wrong.", error: err });
            if (categories) {
                const categoryList = createCategories(categories);
                return res.status(200).json({ categoryList });
            }
        });
};

exports.addCategory = (req, res) => {
    const categoryObj = {
        name: req.body.name,
        type: req.body.type,
        slug: slugify(req.body.name)
    }

    if (req.body.parentId) categoryObj.parentId = req.body.parentId;
    if (req.file) categoryObj.categoryImage = 'public/' + req.file.filename;

    const _cat = new Category(categoryObj);
    _cat.save((err, cat) => {
        if (err) return res.status(400).json({ message: "Category already exists.", error: err });
        if (cat) return res.status(201).json({ message: "Category added successfully.", category: cat });
    });
};

exports.updateCategory = async (req, res) => {
    const { _id, name, parentId, type } = req.body;
    const _cats = [];
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const _category = {
                name: name[i],
                slug: slugify(name[i]),
                type: type[i]
            };
            if (parentId[i] !== "") {
                _category.parentId = parentId[i];
            }
            const _cat = await Category.findOneAndUpdate({ _id: _id[i] }, _category, { new: true });
            _cats.push(_cat);
        }
        return res.status(201).json({
            message: 'Categories updated successfully',
            categories: _cats
        });
    } else {
        const _category = { name: name, type: type, slug: slugify(name) };
        if (parentId !== "") {
            _category.parentId = parentId;
        }
        const _cat = await Category.findOneAndUpdate({ _id }, _category, { new: true });

        return res.status(201).json({
            message: 'Category updated successfully',
            categories: [_cat]
        });
    }
};

exports.deleteCategory = async (req, res) => {
    const { ids } = req.body.payload;
    const cats = [];
    for (let i = 0; i < ids.length; i++) {
        const cat = await Category.findOneAndDelete({ _id: ids[i]._id });
        cats.push(cat);
    }

    if (ids.length == cats.length) {
        return res.status(200).json({ message: 'Category(s) deleted successfully.' });
    } else {
        return res.status(400).json({ message: 'Something went wrong!' });
    }
}