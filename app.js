const express = require('express');
const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());
// Middleware для парсинга данных форм
app.use(express.urlencoded({ extended: false }));

// Собственное middleware для логирования
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Массив для хранения цифровых товаров (вместо базы данных)
let digitalProducts = [
  {
    id: 1,
    name: "Adobe Photoshop 2024 (Лицензия)",
    price: 23990,
    category: "Программное обеспечение",
    description: "Профессиональный графический редактор для дизайнеров",
    fileSize: "2.1 GB",
    licenseType: "Пожизненная",
    downloads: 1245
  },
  {
    id: 2,
    name: "Курс по React: Полное руководство",
    price: 8900,
    category: "Онлайн-курсы",
    description: "Исчерпывающий курс по React с нуля",
    fileSize: "15.7 GB",
    licenseType: "Пожизненный доступ",
    downloads: 3210
  },
  {
    id: 3,
    name: "Фотобанк Премиум: 5000+ фото",
    price: 12990,
    category: "Стоковые медиа",
    description: "Коллекция профессиональных фотографий",
    fileSize: "8.5 GB",
    licenseType: "Коммерческая",
    downloads: 890
  }
];

// Генератор ID для новых товаров
let nextId = 4;

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.json({
    message: '🏪 Добро пожаловать в API цифрового магазина!',
    endpoints: {
      getAllProducts: 'GET /api/products',
      getProductById: 'GET /api/products/:id',
      createProduct: 'POST /api/products',
      updateProduct: 'PUT /api/products/:id',
      deleteProduct: 'DELETE /api/products/:id',
      getCategories: 'GET /api/products/categories'
    },
    totalProducts: digitalProducts.length
  });
});

// Получить все товары
app.get('/api/products', (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filteredProducts = [...digitalProducts];

    // Фильтрация по категории
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Фильтрация по минимальной цене
    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredProducts = filteredProducts.filter(
        product => product.price >= min
      );
    }

    // Фильтрация по максимальной цене
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredProducts = filteredProducts.filter(
        product => product.price <= max
      );
    }

    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении товаров',
      error: error.message
    });
  }
});

// Получить все категории
app.get('/api/products/categories', (req, res) => {
  try {
    const categories = [...new Set(digitalProducts.map(product => product.category))];
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении категорий',
      error: error.message
    });
  }
});

// Получить товар по ID
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = digitalProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Товар с ID ${id} не найден`
      });
    }

    // Увеличиваем счетчик просмотров
    product.downloads += 1;

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении товара',
      error: error.message
    });
  }
});

// Создать новый товар
app.post('/api/products', (req, res) => {
  try {
    const { name, price, category, description, fileSize, licenseType } = req.body;

    // Валидация обязательных полей
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите название, стоимость и категорию товара'
      });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Стоимость должна быть положительным числом'
      });
    }

    // Создание нового товара
    const newProduct = {
      id: nextId++,
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      description: description || 'Описание отсутствует',
      fileSize: fileSize || 'Не указано',
      licenseType: licenseType || 'Стандартная',
      downloads: 0,
      createdAt: new Date().toISOString()
    };

    digitalProducts.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Товар успешно создан',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании товара',
      error: error.message
    });
  }
});

// Обновить товар
app.put('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, category, description, fileSize, licenseType } = req.body;

    const productIndex = digitalProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Товар с ID ${id} не найден`
      });
    }

    // Обновление полей товара
    const updatedProduct = {
      ...digitalProducts[productIndex],
      ...(name && { name: name.trim() }),
      ...(price !== undefined && { 
        price: typeof price === 'string' ? parseFloat(price) : price 
      }),
      ...(category && { category: category.trim() }),
      ...(description && { description }),
      ...(fileSize && { fileSize }),
      ...(licenseType && { licenseType }),
      updatedAt: new Date().toISOString()
    };

    // Валидация цены
    if (updatedProduct.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Стоимость должна быть положительным числом'
      });
    }

    digitalProducts[productIndex] = updatedProduct;

    res.json({
      success: true,
      message: 'Товар успешно обновлен',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении товара',
      error: error.message
    });
  }
});

// Удалить товар
app.delete('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productIndex = digitalProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Товар с ID ${id} не найден`
      });
    }

    const deletedProduct = digitalProducts.splice(productIndex, 1)[0];

    res.json({
      success: true,
      message: 'Товар успешно удален',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении товара',
      error: error.message
    });
  }
});

// Получить популярные товары
app.get('/api/products/popular', (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const popularProducts = [...digitalProducts]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      count: popularProducts.length,
      data: popularProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении популярных товаров',
      error: error.message
    });
  }
});

// Поиск товаров
app.get('/api/products/search', (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите поисковый запрос (параметр q)'
      });
    }

    const searchTerm = q.toLowerCase();
    const results = digitalProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );

    res.json({
      success: true,
      count: results.length,
      query: searchTerm,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при поиске товаров',
      error: error.message
    });
  }
});

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден',
    requestedUrl: req.url,
    availableEndpoints: [
      'GET /api/products',
      'GET /api/products/:id',
      'POST /api/products',
      'PUT /api/products/:id',
      'DELETE /api/products/:id',
      'GET /api/products/categories',
      'GET /api/products/popular',
      'GET /api/products/search'
    ]
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🏪 Сервер цифрового магазина запущен на http://localhost:${port}`);
  console.log('📋 Доступные маршруты:');
  console.log(`  GET  http://localhost:${port}/api/products - Все товары`);
  console.log(`  GET  http://localhost:${port}/api/products/:id - Товар по ID`);
  console.log(`  POST http://localhost:${port}/api/products - Создать товар`);
  console.log(`  PUT  http://localhost:${port}/api/products/:id - Обновить товар`);
  console.log(`  DELETE http://localhost:${port}/api/products/:id - Удалить товар`);
  console.log(`  GET  http://localhost:${port}/api/products/categories - Категории`);
  console.log(`  GET  http://localhost:${port}/api/products/popular - Популярные`);
  console.log(`  GET  http://localhost:${port}/api/products/search - Поиск`);
});