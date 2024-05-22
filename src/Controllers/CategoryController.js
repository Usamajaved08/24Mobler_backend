import Category from '../Models/Category.js';

const addNewCategory = async (req, res) => {
    try {
        const { categoryType } = req.body;
        const existingCategory = await Category.findOne({ categoryType });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const newCategory = new Category({ categoryType });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export { addNewCategory };