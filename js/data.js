const categories = [
    { id: 'all', name: 'Todos los productos' },
    { id: 'electronics', name: 'Electrónicos' },
    { id: 'clothing', name: 'Ropa' },
    { id: 'accessories', name: 'Accesorios' }
];

const categoryOffers = {
    electronics: [
        {
            title: '¡Oferta Flash!',
            message: '20% OFF en todos los smartphones Samsung',
            productId: 1,
            action: 'Ver producto',
            discount: 20
        },
        {
            title: '¡Último día!',
            message: 'Laptops gaming con envío gratis',
            productId: 2,
            action: 'Aprovecha ahora',
            discount: 15
        },
        {
            title: '¡Super promo!',
            message: 'Auriculares Sony - 2x1 en accesorios',
            productId: 3,
            action: 'Ver oferta',
            discount: 25
        }
    ],
    clothing: [
        {
            title: '¡Temporada de descuentos!',
            message: 'Ropa deportiva hasta 30% OFF',
            categoryId: 'clothing',
            action: 'Ver colección',
            discount: 30
        },
        {
            title: '¡Oferta especial!',
            message: 'Zapatillas Nike - Comprá 2 y llevate 3',
            productId: 5,
            action: 'Aprovechar',
            discount: 25
        },
        {
            title: '¡Liquidación!',
            message: 'Camisetas deportivas desde $1500',
            productId: 4,
            action: 'Comprar ahora',
            discount: 40
        }
    ],
    accessories: [
        {
            title: '¡Envío gratis!',
            message: 'Mochilas premium con 6 cuotas sin interés',
            productId: 6,
            action: 'Financiar compra',
            discount: 0
        },
        {
            title: '¡Combo perfecto!',
            message: 'Accesorios + 15% extra en segunda compra',
            categoryId: 'accessories',
            action: 'Ver combos',
            discount: 15
        }
    ]
};

const products = [
    {
        id: 1,
        name: 'Celular Samsung Galaxy S25',
        description: 'Teléfono inteligente de última generación con cámara de 108MP y pantalla AMOLED de 6.7 pulgadas',
        price: 45000,
        image: 's25-ultra-gold.png',
        category: 'electronics',
        gallery: [
            's25-ultra-gold.png',
            's25-ultra-1.jpg',
            's25-ultra-2.jpg'
        ],
        category: 'electronics',
        specifications: {
            'Pantalla': '6.7" Dynamic AMOLED 2X',
            'Cámara': '108MP + 12MP + 10MP + 10MP',
            'Procesador': 'Snapdragon 8 Gen 3',
            'RAM': '12GB',
            'Almacenamiento': '256GB',
            'Batería': '5000mAh'
        },
        stock: 15,
        rating: 4.8
    },
    {
        id: 2,
        name: 'Laptop Gigabyte AORUS 5 SE4',
        description: 'Laptop para gaming con procesador Intel i7, 16GB RAM y tarjeta gráfica RTX 3070',
        price: 120000,
        image: 'gigabyte-aorus.png',
        category: 'electronics',
        gallery: [
            'gigabyte-aorus.png',
            'gigabyte-aorus-open.jpg',
            'gigabyte-aorus-keyboard.jpg'
        ],
        specifications: {
            'Procesador': 'Intel Core i7-11800H',
            'Tarjeta Gráfica': 'NVIDIA RTX 3070 8GB',
            'RAM': '16GB DDR4',
            'Almacenamiento': '1TB NVMe SSD',
            'Pantalla': '15.6" 144Hz IPS',
            'Peso': '2.4kg'
        },
        stock: 8,
        rating: 4.6
    },
    {
        id: 3,
        name: 'Auriculares Sony WF-XB700',
        description: 'Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería',
        price: 15000,
        image: 'wf-xb700-black.png',
        category: 'electronics',
        gallery: [
            'wf-xb700-black.png',
            'wf-xb700-case.jpg',
            'wf-xb700-ear.jpg'
        ],
        specifications: {
            'Conectividad': 'Bluetooth 5.0',
            'Batería': '9h + 18h con estuche',
            'Resistencia': 'IPX4',
            'Drivers': '12mm dinámicos',
            'Peso': '8g cada auricular',
            'Carga rápida': '10min = 1h reproducción'
        },
        stock: 25,
        rating: 4.4
    },
    {
        id: 4,
        name: 'Camiseta Deportiva Elite',
        description: 'Camiseta de alto rendimiento con tecnología de absorción de humedad',
        price: 2500,
        image: 'camisetas-deportivas.png',
        category: 'clothing',
        gallery: [
            'camisetas-deportivas.png',
            'camisetas-deportivas-green.jpg',
            'camisetas-deportivas-red.jpg'
        ],
        specifications: {
            'Material': '100% Poliéster Dri-FIT',
            'Tallas': 'S, M, L, XL, XXL',
            'Colores': 'Negro, Azul, Rojo, Blanco',
            'Cuidado': 'Lavado a máquina 30°C',
            'Origen': 'Colombia',
            'Certificación': 'Fair Trade'
        },
        stock: 50,
        rating: 4.2
    },
    {
        id: 5,
        name: 'Zapatillas Nike Air Max 97',
        description: 'Zapatillas para correr con amortiguación avanzada y suela antideslizante',
        price: 8500,
        image: 'air-max-97.png',
        category: 'clothing',
        gallery: [
            'air-max-97.png',
            'air-max-97.png',
            'air-max-97.png'
        ],
        specifications: {
            'Tecnología': 'Air Max longitud completa',
            'Tallas': '36 - 45',
            'Material': 'Mesh + cuero sintético',
            'Suela': 'Goma antideslizante',
            'Peso': '320g (talla 42)',
            'Uso': 'Running, casual'
        },
        stock: 30,
        rating: 4.7
    },
    {
        id: 6,
        name: 'Mochila Korin Flexpack Pro',
        description: 'Mochila resistente al agua con múltiples compartimentos y capacidad de 35L',
        price: 5200,
        image: 'korin-flexpack-pro.png',
        category: 'accessories',
        gallery: [
            'korin-flexpack-pro.png',
            'korin-flexpack-pro-man.jpg',
            'korin-flexpack-pro-safe.jpg'
        ],
        specifications: {
            'Capacidad': '35 litros',
            'Material': 'Nylon 1000D resistente al agua',
            'Dimensiones': '45x30x20cm',
            'Peso': '1.2kg',
            'Compartimentos': 'Laptop 17", tablet, organizer',
            'Seguridad': 'Cremalleras antirrobo'
        },
        stock: 20,
        rating: 4.5
    },
];

const deliveryOptions = {
    home: { label: 'Entrega a domicilio', cost: 500, icon: '🏠' },
    pickup: { label: 'Retiro en tienda', cost: 0, icon: '🏪' },
    express: { label: 'Entrega express', cost: 1500, icon: '⚡' }
};

const paymentMethods = {
    credit: { label: 'Tarjeta de Crédito', icon: '💳', installments: true },
    debit: { label: 'Tarjeta de Débito', icon: '💳', installments: false },
    transfer: { label: 'Transferencia Bancaria', icon: '🏦', installments: false },
    cash: { label: 'Efectivo', icon: '💵', installments: false }
};

const installmentOptions = [
    { value: '1', text: '1 cuota sin interés', rate: 0 },
    { value: '3', text: '3 cuotas sin interés', rate: 0 },
    { value: '6', text: '6 cuotas con 10% de interés', rate: 0.10 },
    { value: '12', text: '12 cuotas con 20% de interés', rate: 0.20 }
];

window.AppData = {
    categories,
    categoryOffers,
    products,
    deliveryOptions,
    paymentMethods,
    installmentOptions
};