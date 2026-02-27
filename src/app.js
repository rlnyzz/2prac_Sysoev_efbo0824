const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log('${new Date().toISOString()} - ${req.method} ${req.url}');
    next();
});

let products = [
    { id: 1, name: 'wireless headphone', price: 8990 },
    { id: 2, name: 'headphones lite', price: 2990 },
    { id: 3, name: 'airpods pro max', price: 12990 },
];

let nextId = products.length + 1;


app.get('/', (req, res) => {
    res.json({
        message: 'Добро пожаловать в API магазина цифровых товаров Сысоева Виталия',
        endpoints: {
            getAllProducts: 'GET /products',
            getProductById: 'GET /products/:id',
            createProduct: 'POST /products',
            updateProduct: 'PUT /products/:id',
            deleteProduct: 'DELETE /products/:id'
        }
    });
});


app.get('/products', (req, res) => {
    res.json({
        count: products.length,
        products: products
    });
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }
    
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
  
    if (!name || !price) {
        return res.status(400).json({ 
            error: 'Поля name и price обязательны' 
        });
    }
    
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ 
            error: 'Цена должна быть положительным числом' 
        });
    }
    
    const newProduct = {
        id: nextId++,
        name: name.trim(),
        price: price
    };
    
    products.push(newProduct);
    
    res.status(201).json({
        message: 'Товар успешно создан',
        product: newProduct
    });
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }
    
    if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
        return res.status(400).json({ 
            error: 'Цена должна быть положительным числом' 
        });
    }
    
    const updatedProduct = {
        ...products[productIndex],
        name: name !== undefined ? name.trim() : products[productIndex].name,
        price: price !== undefined ? price : products[productIndex].price
    };
    
    products[productIndex] = updatedProduct;
    
    res.json({
        message: 'Товар успешно обновлен',
        product: updatedProduct
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== productId);
    
    if (products.length === initialLength) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }
    
    res.json({
        message: 'Товар успешно удален',
        deletedId: productId,
        totalProducts: products.length
    });
});

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Маршрут не найден' 
    });
});


app.listen(port, () => {
    console.log('✅ Сервер запущен на http://localhost:${port}');
    console.log('  GET  /            - Информация о API');
    console.log('  GET  /products    - Все товары');
    console.log('  GET  /products/:id - Товар по ID');
    console.log('  POST /products    - Создать товар');
    console.log('  PUT  /products/:id - Обновить товар');
    console.log('  DELETE /products/:id - Удалить товар');
});