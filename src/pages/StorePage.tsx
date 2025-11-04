/**
 * StorePage - Boutique EmotionsCare
 * Apple-like design, minimaliste et élégant
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { useCartStore } from '@/stores/cartStore';
import { storefrontApiRequest, STOREFRONT_QUERY } from '@/lib/shopify';
import type { ShopifyProduct } from '@/types/shopify';
import { toast } from 'sonner';

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Erreur de chargement", {
          description: "Impossible de charger les produits"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0].node;
    
    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    
    toast.success("Ajouté au panier ✨", {
      description: product.node.title,
      position: "top-center"
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Skip Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EmotionsCare Store</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
            <CartDrawer />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Nouvelle Collection
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmotionsCare Store
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              La boutique officielle du bien-être émotionnel.<br />
              Chaque produit débloque une expérience digitale exclusive.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-success" />
                <span>Qualité Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-warning" />
                <span>Accès Digital Inclus</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-info" />
                <span>Livraison Soignée</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <main id="main-content" className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Nos Produits</h2>
          <p className="text-muted-foreground">
            Une sélection d'objets thérapeutiques pour votre bien-être quotidien
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit disponible</h3>
              <p className="text-muted-foreground">
                Les produits arrivent bientôt...
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const imageUrl = product.node.images.edges[0]?.node.url;
              const price = product.node.priceRange.minVariantPrice;
              const variant = product.node.variants.edges[0]?.node;

              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all">
                    <Link to={`/store/product/${product.node.handle}`}>
                      <div className="aspect-square bg-muted/30 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="h-16 w-16 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{product.node.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.node.description?.replace(/<[^>]*>/g, '').substring(0, 100)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {price.currencyCode} ${parseFloat(price.amount).toFixed(2)}
                        </span>
                        {variant?.availableForSale && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            En stock
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleAddToCart(product)}
                        disabled={!variant?.availableForSale}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Ajouter au panier
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">EmotionsCare Store</h3>
            <p className="text-muted-foreground mb-4">
              Reconnecte-toi à toi-même. Une marque premium, rentable et profondément humaine.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/legal/privacy" className="hover:text-foreground transition-colors">
                Confidentialité
              </Link>
              <Link to="/legal/terms" className="hover:text-foreground transition-colors">
                CGV
              </Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              © 2025 EmotionsCare - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorePage;
