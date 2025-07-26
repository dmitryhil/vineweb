const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gazvalinskiy:gazvalinskiy@basay.jcusogg.mongodb.net/vinesent?retryWrites=true&w=majority&appName=BasaY';
// Подключение к MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Подключение к MongoDB успешно'))
.catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Схемы MongoDB
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { 
    type: String, 
    required: true,
    enum: ['men', 'women', 'children', 'accessories']
  },
  subcategory: {
    type: String,
    required: true,
    enum: [
      'jeans', 'sweatpants', 'sweatshirts', 'hoodies', 'shirts', 't-shirts',
      'swimsuits', 'shorts', 'tank-tops', 'skirts', 'business-suits',
      'dresses', 'jackets', 'windbreakers', 'bags', 'belts', 'accessories-other'
    ]
  },
  gender: {
    type: String,
    enum: ['boys', 'girls', null],
    default: null
  },
  sizes: [{
    type: String,
    required: true
  }],
  image: { type: String },
  images: [{ type: String }], // Дополнительные изображения
  isNew: { type: Boolean, default: false },
  discount: { type: Number, min: 0, max: 100 },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'Україна' }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true }
    }
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Модели
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Создание папки для загрузок
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth header:', authHeader); // Для отладки
  console.log('Token:', token); // Для отладки

  if (!token) {
    console.log('Token missing'); // Для отладки
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification error:', err); // Для отладки
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    console.log('Authenticated user:', user); // Для отладки
    req.user = user;
    next();
  });
};

// Middleware для проверки роли администратора
const requireAdmin = (req, res, next) => {
  console.log('Checking admin role for user:', req.user); // Для отладки
  if (req.user.role !== 'admin') {
    console.log('User is not admin'); // Для отладки
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

// Создание администратора по умолчанию
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        email: 'admin@vinesent.ua',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Администратор',
        lastName: 'Системы'
      });
      await admin.save();
      console.log('Администратор по умолчанию создан: admin / admin123');
    }
  } catch (error) {
    console.error('Ошибка создания администратора:', error);
  }
};

// Создание тестовых товаров
const createSampleProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Класичні чоловічі джинси',
          description: 'Стильні чоловічі джинси з високоякісного деніму. Ідеально підходять для повсякденного носіння.',
          price: 1299,
          originalPrice: 1599,
          category: 'men',
          subcategory: 'jeans',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          isNew: false,
          discount: 19,
          inStock: true,
          stockQuantity: 25,
          tags: ['джинси', 'чоловічий', 'денім']
        },
        {
          name: 'Елегантна жіноча сукня',
          description: 'Красива жіноча сукня для особливих випадків. Виготовлена з якісних матеріалів.',
          price: 2199,
          category: 'women',
          subcategory: 'dresses',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          isNew: true,
          inStock: true,
          stockQuantity: 15,
          tags: ['сукня', 'жіночий', 'елегантний']
        },
        {
          name: 'Дитяча футболка для хлопчиків',
          description: 'М\'яка бавовняна футболка для хлопчиків. Зручна та практична.',
          price: 399,
          category: 'children',
          subcategory: 't-shirts',
          gender: 'boys',
          sizes: ['98', '104', '110', '116', '122', '128', '134', '140'],
          isNew: false,
          inStock: true,
          stockQuantity: 30,
          tags: ['футболка', 'дитячий', 'хлопчики']
        },
        {
          name: 'Дитяча спідниця для дівчаток',
          description: 'Красива спідниця для дівчаток. Ідеальна для школи та прогулянок.',
          price: 599,
          category: 'children',
          subcategory: 'skirts',
          gender: 'girls',
          sizes: ['98', '104', '110', '116', '122', '128', '134', '140'],
          isNew: true,
          inStock: true,
          stockQuantity: 20,
          tags: ['спідниця', 'дитячий', 'дівчатка']
        },
        {
          name: 'Шкіряна сумка',
          description: 'Стильна шкіряна сумка для повсякденного використання.',
          price: 1899,
          category: 'accessories',
          subcategory: 'bags',
          sizes: ['One Size'],
          isNew: false,
          inStock: true,
          stockQuantity: 10,
          tags: ['сумка', 'аксесуари', 'шкіра']
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('Тестовые товары созданы');
    }
  } catch (error) {
    console.error('Ошибка создания тестовых товаров:', error);
  }
};

// Инициализация данных
createDefaultAdmin();
createSampleProducts();

// ROUTES

// Аутентификация
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Обновление времени последнего входа
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;
    
    // Проверка существования пользователя
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Пользователь с таким именем или email уже существует' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone
    });

    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение всех товаров
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      gender, 
      search, 
      minPrice, 
      maxPrice, 
      sizes, 
      isNew, 
      inStock,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (sizes) {
      const sizeArray = sizes.split(',');
      filter.sizes = { $in: sizeArray };
    }

    if (isNew !== undefined) {
      filter.isNew = isNew === 'true';
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// Получение товара по ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    res.status(500).json({ error: 'Ошибка при получении товара' });
  }
});

// Создание нового товара (только для админов)
app.post('/api/products', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Creating product with data:', req.body); // Для отладки
    console.log('Files received:', req.files); // Для отладки

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      sizes,
      isNew,
      discount,
      inStock,
      stockQuantity,
      tags
    } = req.body;

    // Валидация обязательных полей
    if (!name || !description || !price || !category || !subcategory || !sizes) {
      return res.status(400).json({ 
        error: 'Отсутствуют обязательные поля: name, description, price, category, subcategory, sizes' 
      });
    }

    const productData = {
      name,
      description,
      price: parseInt(price),
      category,
      subcategory,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      isNew: isNew === 'true' || isNew === true,
      inStock: inStock !== 'false' && inStock !== false,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0
    };

    if (originalPrice) productData.originalPrice = parseInt(originalPrice);
    if (gender && gender !== 'null' && gender !== 'undefined') productData.gender = gender;
    if (discount) productData.discount = parseInt(discount);
    
    // Обработка множественных изображений
    if (req.files && req.files.length > 0) {
      productData.image = `/uploads/${req.files[0].filename}`; // Главное изображение
      productData.images = req.files.map(file => `/uploads/${file.filename}`); // Все изображения
    }
    
    if (tags) {
      productData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    console.log('Final product data:', productData); // Для отладки

    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('Product saved successfully:', savedProduct); // Для отладки
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Ошибка создания товара:', error);
    res.status(500).json({ error: 'Ошибка при создании товара: ' + error.message });
  }
});

// Обновление товара (только для админов)
app.put('/api/products/:id', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Updating product ID:', req.params.id); // Для отладки
    console.log('Update data:', req.body); // Для отладки
    console.log('Files received:', req.files); // Для отладки

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const {
      name,
      description,
      price,
      originalPrice,
      category,
      subcategory,
      gender,
      sizes,
      isNew,
      discount,
      inStock,
      stockQuantity,
      tags
    } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseInt(price);
    if (originalPrice) updateData.originalPrice = parseInt(originalPrice);
    if (category) updateData.category = category;
    if (subcategory) updateData.subcategory = subcategory;
    if (gender && gender !== 'null' && gender !== 'undefined') updateData.gender = gender;
    if (sizes) updateData.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    if (isNew !== undefined) updateData.isNew = isNew === 'true' || isNew === true;
    if (discount) updateData.discount = parseInt(discount);
    if (inStock !== undefined) updateData.inStock = inStock !== 'false' && inStock !== false;
    if (stockQuantity) updateData.stockQuantity = parseInt(stockQuantity);
    if (tags) updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    
    // Обработка множественных изображений при обновлении
    if (req.files && req.files.length > 0) {
      // Удаляем старые изображения
      if (product.images && product.images.length > 0) {
        product.images.forEach(imagePath => {
          if (imagePath.startsWith('/uploads/')) {
            const fullPath = path.join(__dirname, imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        });
      }
      
      updateData.image = `/uploads/${req.files[0].filename}`; // Главное изображение
      updateData.images = req.files.map(file => `/uploads/${file.filename}`); // Все изображения
    }

    console.log('Final update data:', updateData); // Для отладки

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('Product updated successfully:', updatedProduct); // Для отладки
    res.json(updatedProduct);
  } catch (error) {
    console.error('Ошибка обновления товара:', error);
    res.status(500).json({ error: 'Ошибка при обновлении товара: ' + error.message });
  }
});

// Удаление товара (только для админов)
app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Deleting product ID:', req.params.id); // Для отладки

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log('Product not found'); // Для отладки
      return res.status(404).json({ error: 'Товар не найден' });
    }

    console.log('Product found:', product); // Для отладки

    // Удаление файлов изображений
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        if (imagePath.startsWith('/uploads/')) {
          const fullPath = path.join(__dirname, imagePath);
          console.log('Trying to delete image:', fullPath); // Для отладки
          if (fs.existsSync(fullPath)) {
            try {
              fs.unlinkSync(fullPath);
              console.log('Image deleted successfully'); // Для отладки
            } catch (err) {
              console.error('Error deleting image:', err); // Для отладки
            }
          }
        }
      });
    }

    // Также удаляем главное изображение, если оно отличается
    if (product.image && product.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, product.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Error deleting main image:', err);
        }
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully:', deletedProduct); // Для отладки
    
    res.json({ message: 'Товар успешно удален', deletedProduct });
  } catch (error) {
    console.error('Ошибка удаления товара:', error);
    res.status(500).json({ error: 'Ошибка при удалении товара: ' + error.message });
  }
});

// Создание заказа
app.post('/api/orders', async (req, res) => {
  try {
    const { user, items, totalAmount, paymentMethod, notes } = req.body;
    
    // Генерация номера заказа
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const order = new Order({
      orderNumber,
      user,
      items,
      totalAmount,
      paymentMethod,
      notes
    });

    await order.save();
    
    // Обновление количества товаров в наличии
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stockQuantity: -item.quantity } }
        );
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

// Получение заказов (только для админов)
app.get('/api/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

// Обновление статуса заказа (только для админов)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json(order);
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    res.status(500).json({ error: 'Ошибка при обновлении заказа' });
  }
});

// Добавьте роут для тестирования аутентификации
app.get('/api/auth/test', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Аутентификация работает', 
    user: req.user 
  });
});

// Добавьте роут для тестирования прав администратора
app.get('/api/admin/test', authenticateToken, requireAdmin, (req, res) => {
  res.json({ 
    message: 'Права администратора подтверждены', 
    user: req.user 
  });
});

// Получение статистики (только для админов)
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('items.product');
    
    const lowStockProducts = await Product.find({
      stockQuantity: { $lt: 5 },
      inStock: true
    }).limit(10);

    const stats = {
      totalProducts,
      totalOrders,
      totalUsers,
      productsByCategory: productsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentOrders,
      lowStockProducts,
      inStockProducts: await Product.countDocuments({ inStock: true }),
      outOfStockProducts: await Product.countDocuments({ inStock: false }),
      newProducts: await Product.countDocuments({ isNew: true }),
      discountedProducts: await Product.countDocuments({ discount: { $gt: 0 } })
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

// Загрузка изображения
app.post('/api/upload', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    
    res.json({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size
    });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ error: 'Ошибка при загрузке файла' });
  }
});

// Обработка ошибок
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой' });
    }
  }
  console.error('Ошибка сервера:', error);
  res.status(500).json({ error: error.message });
});

// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});


// Схема для корзины пользователя
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

// Схема для списка желаний
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  updatedAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// API для корзины
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart ? cart.items : []);
  } catch (error) {
    console.error('Ошибка получения корзины:', error);
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId && item.size === size
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, quantity });
    }
    
    cart.updatedAt = new Date();
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart.items);
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error);
    res.status(500).json({ error: 'Ошибка при добавлении в корзину' });
  }
});

app.put('/api/cart/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Корзина не найдена' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Товар в корзине не найден' });
    }
    
    item.quantity = quantity;
    cart.updatedAt = new Date();
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart.items);
  } catch (error) {
    console.error('Ошибка обновления корзины:', error);
    res.status(500).json({ error: 'Ошибка при обновлении корзины' });
  }
});

app.delete('/api/cart/:itemId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Корзина не найдена' });
    }
    
    cart.items.id(req.params.itemId).remove();
    cart.updatedAt = new Date();
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart.items);
  } catch (error) {
    console.error('Ошибка удаления из корзины:', error);
    res.status(500).json({ error: 'Ошибка при удалении из корзины' });
  }
});

app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error('Ошибка очистки корзины:', error);
    res.status(500).json({ error: 'Ошибка при очистке корзины' });
  }
});

// API для списка желаний
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(wishlist ? wishlist.products : []);
  } catch (error) {
    console.error('Ошибка получения списка желаний:', error);
    res.status(500).json({ error: 'Ошибка при получении списка желаний' });
  }
});

app.post('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }
    
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      wishlist.updatedAt = new Date();
      await wishlist.save();
    }
    
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.json(populatedWishlist.products);
  } catch (error) {
    console.error('Ошибка добавления в список желаний:', error);
    res.status(500).json({ error: 'Ошибка при добавлении в список желаний' });
  }
});

app.delete('/api/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Список желаний не найден' });
    }
    
    wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
    wishlist.updatedAt = new Date();
    await wishlist.save();
    
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    res.json(populatedWishlist.products);
  } catch (error) {
    console.error('Ошибка удаления из списка желаний:', error);
    res.status(500).json({ error: 'Ошибка при удалении из списка желаний' });
  }
});