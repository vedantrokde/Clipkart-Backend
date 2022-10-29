const Page = require('../../models/page');

exports.createPage = (req, res) => {
    const { banners, products } = req.files;

    if (banners && banners.length > 0) {
        req.body.banners = banners.map((banner, index) => ({
            img: `/public/${banner.filename}`,
            navigateTo: `/bannerClicked?cid=${req.body.category}&type=${req.body.type}`
        }))
    }
    if (products && products.length > 0) {
        req.body.products = products.map((product, index) => ({
            img: `/public/${product.filename}`,
            navigateTo: `/productClicked?cid=${req.body.category}&type=${req.body.type}`
        }))
    }

    Page.findOne({ category: req.body.category })
        .exec((err, page) => {
            if (err) return res.status(400).json({ message: 'Something went wrong', error: error });
            if (page) {
                Page.findOneAndUpdate({ category: req.body.category }, req.body, { new: true })
                    .exec((err, updatedPage) => {
                        if (err) return res.status(400).json({ message: 'Something went wrong', error: error });
                        if (updatedPage) res.status(201).json({ message: 'Category page updated successfully', page: updatedPage });
                    })
            } else {
                const pageObj = {
                    title: req.body.title,
                    description: req.body.desc,
                    banners: req.body.banners,
                    products: req.body.products,
                    category: req.body.category,
                    createdBy: req.user._id
                }

                const _page = new Page(pageObj);
                _page.save((err, page) => {
                    if (err) return res.status(400).json({ message: "Something went wrong.", error: err });
                    if (page) return res.status(201).json({ message: "New Category Page added successfully.", page: page });
                });
            }
        })
};

exports.viewPages = (req, res) => {
    Page.find({})
        .exec((err, pages) => {
            if (err) return res.status(400).json({ message: "Something went wrong.", error: err });
            if (pages) return res.status(200).json({ pages });
        });
};

exports.getPage = (req, res) => {
    const { category, type } = req.params;
    if (type === "page") {
        Page.findOne({ category: category })
            .exec((err, page) => {
                if (err) return res.status(400).json({ message: "Something went wrong.", error: err });
                if (page) return res.status(200).json({ page });
            });
    }
};