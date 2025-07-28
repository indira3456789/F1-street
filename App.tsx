 import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Menu, X, Plus, Minus, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Sample products data with category-specific images
const sampleProducts: Product[] = [
  // Tees
  { 
    id: '1', 
    name: 'F1 Racing Heritage Tee', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Premium cotton racing inspired t-shirt with modern fit and vintage F1 graphics' 
  },
  { 
    id: '2', 
    name: 'Monaco GP Commemorative Tee', 
    price: 50, 
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Limited edition Monaco Grand Prix commemorative tee with circuit map design' 
  },
  { 
    id: '3', 
    name: 'Pit Crew Performance Tee', 
    price: 42, 
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Professional pit crew inspired design with moisture-wicking fabric' 
  },
  { 
    id: '4', 
    name: 'Speed Demon Racing Tee', 
    price: 48, 
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Bold racing graphics tee for true speed enthusiasts with premium cotton blend' 
  },
  { 
    id: '5', 
    name: 'Victory Lap Celebration Tee', 
    price: 46, 
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Celebrate victory in style with this premium racing championship tee' 
  },
  { 
    id: '6', 
    name: 'Circuit Master Graphic Tee', 
    price: 44, 
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&h=500&fit=crop', 
    category: 'Tees', 
    description: 'Master the circuit with this sleek racing tee featuring iconic track layouts' 
  },

  // Jackets
  { 
    id: '7', 
    name: 'Racing Team Bomber Jacket', 
    price: 120, 
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 
    category: 'Jackets', 
    description: 'Premium racing bomber jacket with wind-resistant fabric and team patches' 
  },
  { 
    id: '8', 
    name: 'F1 Driver Replica Jacket', 
    price: 135, 
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop', 
    category: 'Jackets', 
    description: 'Official driver replica jacket with authentic team colors and sponsor logos' 
  },
  { 
    id: '9', 
    name: 'Pit Lane Technical Jacket', 
    price: 98, 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', 
    category: 'Jackets', 
    description: 'Technical jacket inspired by pit lane fashion with multiple functional pockets' 
  },
  { 
    id: '10', 
    name: 'Speed Windbreaker Pro', 
    price: 85, 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', 
    category: 'Jackets', 
    description: 'Lightweight windbreaker perfect for racing conditions with reflective details' 
  },
  { 
    id: '11', 
    name: 'Grand Prix Luxury Jacket', 
    price: 150, 
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500&h=500&fit=crop', 
    category: 'Jackets', 
    description: 'Luxury racing jacket with premium materials and sophisticated design' 
  },

  // Caps
  { 
    id: '12', 
    name: 'F1 Classic Racing Cap', 
    price: 35, 
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500&h=500&fit=crop', 
    category: 'Caps', 
    description: 'Classic F1 inspired cap with embroidered logo and adjustable strap' 
  },
  { 
    id: '13', 
    name: 'Racing Team Snapback', 
    price: 32, 
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop', 
    category: 'Caps', 
    description: 'Modern snapback with racing graphics and flat brim design' 
  },
  { 
    id: '14', 
    name: 'Pit Crew Professional Cap', 
    price: 38, 
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&h=500&fit=crop', 
    category: 'Caps', 
    description: 'Professional pit crew style cap with moisture-wicking headband' 
  },
  { 
    id: '15', 
    name: 'Speed Demon Visor', 
    price: 28, 
    image: 'https://images.unsplash.com/photo-1566479179817-c0c8b3ac8bb3?w=500&h=500&fit=crop', 
    category: 'Caps', 
    description: 'Athletic visor for racing enthusiasts with UV protection' 
  },
  { 
    id: '16', 
    name: 'Victory Championship Cap', 
    price: 40, 
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop', 
    category: 'Caps', 
    description: 'Championship victory commemorative cap with gold embroidery details' 
  },

  // Accessories
  { 
    id: '17', 
    name: 'Racing Chain Necklace', 
    price: 65, 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Premium stainless steel chain with racing-inspired pendant design' 
  },
  { 
    id: '18', 
    name: 'F1 Titanium Bracelet', 
    price: 85, 
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Sleek titanium bracelet with engraved racing motifs' 
  },
  { 
    id: '19', 
    name: 'Racing Chronograph Watch', 
    price: 250, 
    image: 'https://images.unsplash.com/photo-1594576662863-ab5cd0e462ff?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Precision racing chronograph watch with tachymeter bezel' 
  },
  { 
    id: '20', 
    name: 'Speed Demon Leather Belt', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Racing inspired leather belt with metal buckle and racing stripe detail' 
  },
  { 
    id: '21', 
    name: 'F1 Premium Keychain', 
    price: 15, 
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Premium metal F1 keychain with enamel logo and leather accent' 
  },
  { 
    id: '22', 
    name: 'Racing Sunglasses Pro', 
    price: 90, 
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop', 
    category: 'Accessories', 
    description: 'Professional racing sunglasses with polarized lenses and sport frame' 
  },

  // Limited Edition
  { 
    id: '23', 
    name: 'Championship Gold Edition Tee', 
    price: 75, 
    image: 'https://images.unsplash.com/photo-1618453292729-adc2ca90f4d4?w=500&h=500&fit=crop', 
    category: 'Limited', 
    description: 'Limited edition championship gold tee - only 100 pieces worldwide' 
  },
  { 
    id: '24', 
    name: 'Monaco Exclusive Racing Jacket', 
    price: 200, 
    image: 'https://images.unsplash.com/photo-1601924284077-f0faf48e3ab2?w=500&h=500&fit=crop', 
    category: 'Limited', 
    description: 'Exclusive Monaco Grand Prix limited edition jacket with numbered certificate' 
  },
  { 
    id: '25', 
    name: 'Legendary Driver Heritage Cap', 
    price: 60, 
    image: 'https://images.unsplash.com/photo-1566479179817-c0c8b3ac8bb3?w=500&h=500&fit=crop', 
    category: 'Limited', 
    description: 'Limited edition cap honoring legendary F1 drivers with special embroidery' 
  },
  { 
    id: '26', 
    name: 'Carbon Fiber Racing Watch', 
    price: 450, 
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop', 
    category: 'Limited', 
    description: 'Ultra-exclusive carbon fiber racing watch with limited production run' 
  },
  { 
    id: '27', 
    name: 'Victory Celebration Collection', 
    price: 150, 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', 
    category: 'Limited', 
    description: 'Limited celebration collection with premium tee and cap combo set' 
  },
];

// Components
const Header = () => {
  const { cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-black text-white sticky top-0 z-50 border-b border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
            F1 STREET
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-red-400 transition-colors">Products</Link>
            <Link to="/category/tees" className="hover:text-red-400 transition-colors">Tees</Link>
            <Link to="/category/jackets" className="hover:text-red-400 transition-colors">Jackets</Link>
            <Link to="/category/caps" className="hover:text-red-400 transition-colors">Caps</Link>
            <Link to="/category/accessories" className="hover:text-red-400 transition-colors">Accessories</Link>
            <Link to="/category/limited" className="hover:text-red-400 transition-colors">Limited</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-red-400 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <button className="hover:text-red-400 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <Link to="/cart" className="hover:text-red-400 transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden hover:text-red-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-red-600">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 hover:text-red-400 transition-colors">Home</Link>
            <Link to="/products" className="block py-2 hover:text-red-400 transition-colors">Products</Link>
            <Link to="/category/tees" className="block py-2 hover:text-red-400 transition-colors">Tees</Link>
            <Link to="/category/jackets" className="block py-2 hover:text-red-400 transition-colors">Jackets</Link>
            <Link to="/category/caps" className="block py-2 hover:text-red-400 transition-colors">Caps</Link>
            <Link to="/category/accessories" className="block py-2 hover:text-red-400 transition-colors">Accessories</Link>
            <Link to="/category/limited" className="block py-2 hover:text-red-400 transition-colors">Limited</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-r from-black via-gray-900 to-red-900 text-white py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
          RACE THE STREETS
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Formula 1 inspired streetwear for the modern racer
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
        >
          VIEW ALL PRODUCTS
        </button>
      </div>
    </div>
  );
};

const CategorySection = () => {
  const categories = [
    { name: 'Tees', link: '/category/tees', functional: true },
    { name: 'Jackets', link: '/category/jackets', functional: true },
    { name: 'Caps', link: '/category/caps', functional: true },
    { name: 'Accessories', link: '/category/accessories', functional: true },
    { name: 'Limited', link: '/category/limited', functional: true }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">SHOP BY CATEGORY</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center group"
            >
              <div className="bg-gradient-to-br from-red-500 to-red-700 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:from-red-600 group-hover:to-red-800 transition-all duration-300">
                <span className="text-white font-bold text-xl">{category.name[0]}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white text-black px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
        <p className="text-gray-600 mb-4">${product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <Hero />
      <CategorySection />
    </div>
  );
};

const ProductsPage = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">All Products</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryPage = () => {
  const { products } = useAppContext();
  const { category } = useParams<{ category: string }>();
  
  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || '';
  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === category?.toLowerCase()
  );

  const getCategoryDescription = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'tees': return 'Premium F1-inspired t-shirts for racing enthusiasts';
      case 'jackets': return 'High-performance racing jackets and outerwear';
      case 'caps': return 'Racing caps and headwear for the modern driver';
      case 'accessories': return 'Essential racing accessories including chains, bracelets and watches';
      case 'limited': return 'Exclusive limited edition racing collectibles';
      default: return 'Racing gear for the modern enthusiast';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900">{categoryName}</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">Racing {categoryName}</h1>
        <p className="text-gray-600 mt-2">{getCategoryDescription(categoryName)}</p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found in this category</h3>
          <p className="text-gray-600">Check back soon for new arrivals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductPage = () => {
  const { products, addToCart } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-96 lg:h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-red-600">${product.price}</p>
          </div>
          
          <p className="text-gray-600 text-lg">{product.description}</p>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Size</h3>
            <div className="flex space-x-3">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  className="border border-gray-300 hover:border-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              navigate('/cart');
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useAppContext();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some racing gear to get started</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to F1 STREET</h2>
          <p className="mt-2 text-gray-600">Access your racing gear collection</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>

          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-red-600 hover:text-red-500 font-semibold">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// App Provider
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <AppContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      products: sampleProducts,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Main App
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
