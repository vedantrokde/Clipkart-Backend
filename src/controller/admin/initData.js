const Category = require('../../models/category');
const Product = require('../../models/product');
const Page = require('../../models/page');
const Order = require('../../models/order');

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

exports.initData = async (req, res) => {
    const _categories = await Category.find({}).exec();
    const _pages = await Page.find({})
        .populate({ path: 'category', select: 'name type' })
        .exec();

    const _products = await Product.find({})
        .select('_id name price quantity description category productPictures')
        .populate({ path: 'category', select: '_id name' })
        .exec();
    
    const _orders = await Order.find({})
        .populate("items.productId", "name")
        .exec();

    res.status(200).json({
        categories: createCategories(_categories),
        products: _products,
        pages: _pages,
        orders: _orders
    });
}