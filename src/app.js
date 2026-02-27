const express = require('express');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

let products = [
  { id: nanoid(6), name: 'Ноутбук ASUS ROG', category: 'Ноутбуки', description: 'Игровой ноутбук с RTX 4060, 16GB RAM', price: 120000, stock: 5 },
  { id: nanoid(6), name: 'Смартфон iPhone 15', category: 'Смартфоны', description: '128GB, черный, A16 Bionic', price: 89990, stock: 8 },
  { id: nanoid(6), name: 'Наушники Sony WH-1000XM5', category: 'Аудио', description: 'Беспроводные, шумоподавление', price: 29990, stock: 12 },
  { id: nanoid(6), name: 'Планшет Samsung Tab S9', category: 'Планшеты', description: '11" AMOLED, 256GB', price: 69990, stock: 3 },
  { id: nanoid(6), name: 'Монитор LG 27" 4K', category: 'Мониторы', description: 'IPS, HDR10, USB-C', price: 34990, stock: 7 },
  { id: nanoid(6), name: 'Клавиатура Logitech MX', category: 'Аксессуары', description: 'Механическая, беспроводная', price: 12990, stock: 15 },
  { id: nanoid(6), name: 'Мышь Razer DeathAdder', category: 'Аксессуары', description: 'Оптическая, 16000 DPI', price: 4990, stock: 20 },
  { id: nanoid(6), name: 'Внешний SSD Samsung T7', category: 'Хранение', description: '1TB, USB 3.2', price: 8990, stock: 9 },
  { id: nanoid(6), name: 'Умные часы Galaxy Watch 6', category: 'Гаджеты', description: '44mm, GPS, Bluetooth', price: 24990, stock: 4 },
  { id: nanoid(6), name: 'Роутер TP-Link Archer', category: 'Сетевое', description: 'WiFi 6, гигабитный', price: 7990, stock: 6 }
];

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}


app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock } = req.body;
  
  if (!name?.trim() || !category?.trim() || !description?.trim() || 
      price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock)
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;

  const { name, category, description, price, stock } = req.body;
  
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);

  res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  
  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});