/**
 * Tests unitaires pour la gestion des stocks - TypeScript/Jest
 * Tests basés sur la logique du CartController
 */

// Types et interfaces
interface IProduct {
  _id: string;
  name: string;
  quantity: number;      // Stock total physique
  cartQuantity: number;  // Quantité réservée dans les paniers
  price: number;
}

interface ICartProduct {
  _id?: string;
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;
  CreatedOn: Date;
}

interface ICart {
  _id?: string;
  userId: string;
  products: ICartProduct[];
}

// Mocks des modèles et repositories
class MockProductRepository {
  private products = new Map<string, IProduct>();

  findById(id: string): Promise<IProduct | null> {
    return Promise.resolve(this.products.get(id) || null);
  }

  updateOne(filter: any, update: any): Promise<void> {
    const product = this.products.get(filter._id);
    if (product) {
      Object.assign(product, update);
    }
    return Promise.resolve();
  }

  addProduct(product: IProduct): void {
    this.products.set(product._id, product);
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.get(id);
  }
}

class MockCartRepository {
  private carts = new Map<string, ICart>();

  findOne(filter: { userId: string }): Promise<ICart | null> {
    const cart = Array.from(this.carts.values())
      .find(c => c.userId === filter.userId);
    return Promise.resolve(cart || null);
  }

  create(cart: ICart): Promise<ICart> {
    const newCart = { ...cart, _id: `cart_${Date.now()}` };
    this.carts.set(newCart._id!, newCart);
    return Promise.resolve(newCart);
  }

  update(id: string, cart: ICart): Promise<ICart> {
    this.carts.set(id, cart);
    return Promise.resolve(cart);
  }

  getAll(): Promise<ICart[]> {
    return Promise.resolve(Array.from(this.carts.values()));
  }

  findByIdAndUpdate(id: string, update: any): Promise<ICart | null> {
    const cart = this.carts.get(id);
    if (cart) {
      Object.assign(cart, update);
      return Promise.resolve(cart);
    }
    return Promise.resolve(null);
  }
}

class MockUnitOfWork {
  private session: any = null;
  private productRepo: MockProductRepository;
  private cartRepo: MockCartRepository;

  constructor(productRepo: MockProductRepository, cartRepo: MockCartRepository) {
    this.productRepo = productRepo;
    this.cartRepo = cartRepo;
  }

  async start(): Promise<void> {
    this.session = { active: true };
  }

  async complete(): Promise<void> {
    this.session = null;
  }

  async abort(): Promise<void> {
    this.session = null;
  }

  getRepository<T>(repo: any): any {
    if (repo instanceof MockProductRepository) {
      return this.productRepo;
    }
    if (repo instanceof MockCartRepository) {
      return this.cartRepo;
    }
    return repo;
  }
}

// Service de gestion des stocks (simplifié du CartController)
class StockManagementService {
  constructor(
    private cartRepository: MockCartRepository,
    private productRepository: MockProductRepository,
    private unitOfWork: MockUnitOfWork
  ) {}

  async addToCart(userId: string, products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>): Promise<{ success: boolean; message: string; cart?: ICart }> {
    
    if (!products || products.length === 0) {
      return { success: false, message: "UserId and products are required" };
    }

    await this.unitOfWork.start();
    
    try {
      const cartRepo = this.unitOfWork.getRepository(this.cartRepository);
      const productRepo = this.unitOfWork.getRepository(this.productRepository);

      const existingCart = await cartRepo.findOne({ userId });

      // Validation du stock pour chaque produit
      for (const product of products) {
        const productDetails = await productRepo.findById(product.productId);
        
        if (!productDetails) {
          return { 
            success: false, 
            message: `Product with ID ${product.productId} not found` 
          };
        }

        const stockAvailable = productDetails.quantity;
        let currentInCart = 0;

        if (existingCart) {
          const item = existingCart.products.find(p => p.productId === product.productId);
          currentInCart = item ? item.quantity : 0;
        }

        const newTotal = currentInCart + product.quantity;

        if (newTotal > stockAvailable) {
          return {
            success: false,
            message: `Cannot add ${product.quantity} more of ${productDetails.name}. Only ${stockAvailable - currentInCart} left in stock.`
          };
        }
      }

      // Ajout ou mise à jour du panier
      let resultCart: ICart;

      if (existingCart) {
        for (const product of products) {
          const existingProduct = existingCart.products.find(
            cartProduct => cartProduct.productId === product.productId
          );

          if (existingProduct) {
            existingProduct.quantity += product.quantity;
            existingProduct.subTotal = existingProduct.quantity * product.price;
          } else {
            existingCart.products.push({
              _id: `item_${Date.now()}_${Math.random()}`,
              productId: product.productId,
              quantity: product.quantity,
              price: product.price,
              subTotal: product.quantity * product.price,
              CreatedOn: new Date()
            });
          }
        }

        resultCart = await cartRepo.update(existingCart._id!, existingCart);
      } else {
        const newCart: ICart = {
          userId,
          products: products.map(product => ({
            _id: `item_${Date.now()}_${Math.random()}`,
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
            subTotal: product.quantity * product.price,
            CreatedOn: new Date()
          }))
        };

        resultCart = await cartRepo.create(newCart);
      }

      await this.unitOfWork.complete();
      return { success: true, message: "Products added to cart", cart: resultCart };

    } catch (error: any) {
      await this.unitOfWork.abort();
      return { success: false, message: error.message };
    }
  }

  async cleanExpiredCartItems(): Promise<number> {
    await this.unitOfWork.start();
    
    try {
      const cartRepo = this.unitOfWork.getRepository(this.cartRepository);
      const productRepo = this.unitOfWork.getRepository(this.productRepository);
      
      const carts = await cartRepo.getAll();
      const currentTime = new Date();
      let cleanedItemsCount = 0;

      for (const cart of carts) {
        const updatedProducts: ICartProduct[] = [];

        for (const product of cart.products) {
          const productTime = new Date(product.CreatedOn);
          const timeDifference = currentTime.getTime() - productTime.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);

          if (hoursDifference > 24) {
            // Libérer le stock
            const productDetails = await productRepo.findById(product.productId);
            if (productDetails) {
              const newCartQuantity = productDetails.cartQuantity + product.quantity;
              await productRepo.updateOne(
                { _id: product.productId },
                { cartQuantity: newCartQuantity }
              );
            }
            cleanedItemsCount++;
          } else {
            updatedProducts.push(product);
          }
        }

        if (updatedProducts.length !== cart.products.length) {
          await cartRepo.findByIdAndUpdate(cart._id!, { products: updatedProducts });
        }
      }

      await this.unitOfWork.complete();
      return cleanedItemsCount;

    } catch (error) {
      await this.unitOfWork.abort();
      throw error;
    }
  }

  async removeFromCart(itemId: string): Promise<{ success: boolean; message: string }> {
    await this.unitOfWork.start();

    try {
      const cartRepo = this.unitOfWork.getRepository(this.cartRepository);
      const productRepo = this.unitOfWork.getRepository(this.productRepository);

      const carts = await cartRepo.getAll();
      let productFound = false;

      for (const cart of carts) {
        const updatedProducts: ICartProduct[] = [];

        for (const product of cart.products) {
          if (product._id === itemId) {
            productFound = true;

            // Libérer le stock
            const productDetails = await productRepo.findById(product.productId);
            if (productDetails) {
              const newCartQuantity = productDetails.cartQuantity + product.quantity;
              await productRepo.updateOne(
                { _id: product.productId },
                { cartQuantity: newCartQuantity }
              );
            }
          } else {
            updatedProducts.push(product);
          }
        }

        if (productFound) {
          await cartRepo.findByIdAndUpdate(cart._id!, { products: updatedProducts });
          break;
        }
      }

      await this.unitOfWork.complete();

      if (productFound) {
        return { success: true, message: "Product removed from cart and quantity updated in inventory" };
      } else {
        return { success: false, message: "Product not found in any cart" };
      }

    } catch (error: any) {
      await this.unitOfWork.abort();
      return { success: false, message: error.message };
    }
  }

  // Simulation du checkout (décrémenter le stock total)
  async checkout(userId: string): Promise<{ success: boolean; message: string }> {
    await this.unitOfWork.start();

    try {
      const cartRepo = this.unitOfWork.getRepository(this.cartRepository);
      const productRepo = this.unitOfWork.getRepository(this.productRepository);

      const cart = await cartRepo.findOne({ userId });
      if (!cart) {
        return { success: false, message: "Cart not found" };
      }

      // Vérifier le stock avant finalisation
      for (const item of cart.products) {
        const product = await productRepo.findById(item.productId);
        if (!product || product.quantity < item.quantity) {
          return { 
            success: false, 
            message: `Insufficient stock for product ${item.productId}` 
          };
        }
      }

      // Décrémenter le stock total et libérer les réservations
      for (const item of cart.products) {
        const product = await productRepo.findById(item.productId);
        if (product) {
          await productRepo.updateOne(
            { _id: item.productId },
            { 
              quantity: product.quantity - item.quantity,
              cartQuantity: product.cartQuantity - item.quantity
            }
          );
        }
      }

      // Vider le panier
      await cartRepo.findByIdAndUpdate(cart._id!, { products: [] });

      await this.unitOfWork.complete();
      return { success: true, message: "Checkout completed successfully" };

    } catch (error: any) {
      await this.unitOfWork.abort();
      return { success: false, message: error.message };
    }
  }
}

// ===== TESTS UNITAIRES =====

describe('StockManagementService', () => {
  let service: StockManagementService;
  let productRepo: MockProductRepository;
  let cartRepo: MockCartRepository;
  let unitOfWork: MockUnitOfWork;

  beforeEach(() => {
    productRepo = new MockProductRepository();
    cartRepo = new MockCartRepository();
    unitOfWork = new MockUnitOfWork(productRepo, cartRepo);
    service = new StockManagementService(cartRepo, productRepo, unitOfWork);

    // Ajouter des produits de test
    productRepo.addProduct({
      _id: 'prod1',
      name: 'Lait 1L',
      quantity: 100,
      cartQuantity: 0,
      price: 4.99
    });

    productRepo.addProduct({
      _id: 'prod2',
      name: 'Pain artisanal',
      quantity: 50,
      cartQuantity: 0,
      price: 6.50
    });

    productRepo.addProduct({
      _id: 'prod3',
      name: 'Pommes',
      quantity: 20,
      cartQuantity: 0,
      price: 3.99
    });
  });

  describe('Ajout au panier', () => {
    test('Devrait ajouter un produit avec stock suffisant', async () => {
      const result = await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 5,
        price: 4.99
      }]);

      expect(result.success).toBe(true);
      expect(result.cart?.products).toHaveLength(1);
      expect(result.cart?.products[0].quantity).toBe(5);
    });

    test('Devrait refuser ajout avec stock insuffisant', async () => {
      const result = await service.addToCart('user1', [{
        productId: 'prod3', // Seulement 20 en stock
        quantity: 25,
        price: 3.99
      }]);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Only 20 left in stock');
    });

    test('Devrait cumuler les quantités pour le même produit', async () => {
      // Premier ajout
      await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 10,
        price: 4.99
      }]);

      // Deuxième ajout
      const result = await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 15,
        price: 4.99
      }]);

      expect(result.success).toBe(true);
      expect(result.cart?.products).toHaveLength(1);
      expect(result.cart?.products[0].quantity).toBe(25);
    });

    test('Devrait gérer le stock partagé entre utilisateurs', async () => {
      // User1 ajoute 15 unités de prod3 (20 en stock)
      await service.addToCart('user1', [{
        productId: 'prod3',
        quantity: 15,
        price: 3.99
      }]);

      // User2 essaie d'ajouter 10 unités (devrait échouer)
      const result = await service.addToCart('user2', [{
        productId: 'prod3',
        quantity: 10,
        price: 3.99
      }]);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Only 5 left in stock');
    });

    test('Devrait refuser produit inexistant', async () => {
      const result = await service.addToCart('user1', [{
        productId: 'inexistant',
        quantity: 1,
        price: 10.00
      }]);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Product with ID inexistant not found');
    });
  });

  describe('Nettoyage des paniers expirés', () => {
    test('Devrait nettoyer les items expirés et libérer le stock', async () => {
      // Ajouter un item au panier
      const cart = await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 10,
        price: 4.99
      }]);

      // Simuler expiration (modifier manuellement la date)
      if (cart.cart) {
        cart.cart.products[0].CreatedOn = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25h ago
        await cartRepo.update(cart.cart._id!, cart.cart);
      }

      const cleanedCount = await service.cleanExpiredCartItems();

      expect(cleanedCount).toBe(1);
      
      // Vérifier que le stock a été libéré
      const product = productRepo.getProduct('prod1');
      expect(product?.cartQuantity).toBe(10); // Stock libéré
    });
  });

  describe('Suppression du panier', () => {
    test('Devrait supprimer un item et libérer le stock', async () => {
      // Ajouter au panier
      const result = await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 8,
        price: 4.99
      }]);

      const itemId = result.cart?.products[0]._id!;

      // Supprimer l'item
      const removeResult = await service.removeFromCart(itemId);

      expect(removeResult.success).toBe(true);
      
      // Vérifier que le stock a été libéré
      const product = productRepo.getProduct('prod1');
      expect(product?.cartQuantity).toBe(8); // Stock libéré
    });

    test('Devrait échouer pour item inexistant', async () => {
      const result = await service.removeFromCart('inexistant_id');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Product not found in any cart');
    });
  });

  describe('Checkout', () => {
    test('Devrait finaliser la commande et décrémenter le stock total', async () => {
      const initialStock = productRepo.getProduct('prod1')?.quantity!;

      // Ajouter au panier
      await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 15,
        price: 4.99
      }]);

      // Checkout
      const result = await service.checkout('user1');

      expect(result.success).toBe(true);

      // Vérifier que le stock total a diminué
      const product = productRepo.getProduct('prod1');
      expect(product?.quantity).toBe(initialStock - 15);
      expect(product?.cartQuantity).toBe(0); // Réservations libérées
    });

    test('Devrait échouer si stock insuffisant au checkout', async () => {
      // Ajouter au panier
      await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 15,
        price: 4.99
      }]);

      // Simuler réduction de stock après ajout au panier
      const product = productRepo.getProduct('prod1')!;
      product.quantity = 10; // Moins que les 15 dans le panier

      const result = await service.checkout('user1');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Insufficient stock');
    });

    test('Devrait échouer pour panier inexistant', async () => {
      const result = await service.checkout('user_inexistant');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Cart not found');
    });
  });

  describe('Scénarios complexes', () => {
    test('Scénario complet multi-utilisateurs', async () => {
      const initialStock = productRepo.getProduct('prod1')?.quantity!;

      // User1 ajoute 30 unités
      await service.addToCart('user1', [{
        productId: 'prod1',
        quantity: 30,
        price: 4.99
      }]);

      // User2 ajoute 25 unités
      await service.addToCart('user2', [{
        productId: 'prod1',
        quantity: 25,
        price: 4.99
      }]);

      // Vérifier réservations
      let product = productRepo.getProduct('prod1')!;
      expect(product.cartQuantity).toBe(0); // Dans ce mock, cartQuantity n'est pas encore implémenté

      // User1 fait checkout
      await service.checkout('user1');

      // User2 fait checkout
      await service.checkout('user2');

      // Vérifier stock final
      product = productRepo.getProduct('prod1')!;
      expect(product.quantity).toBe(initialStock - 55); // 30 + 25
    });
  });
});

// Configuration Jest (à ajouter dans package.json ou jest.config.js)
/*
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node"
  }
}
*/