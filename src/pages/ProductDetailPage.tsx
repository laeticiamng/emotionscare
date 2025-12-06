/**
 * ProductDetailPage - Détail produit EmotionsCare Store
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Sparkles, Loader2 } from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { useCartStore } from '@/stores/cartStore';
import { storefrontApiRequest } from '@/lib/shopify';
import { formatPrice } from '@/lib/currency';
import type { ShopifyProduct } from '@/types/shopify';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      try {
        setIsLoading(true);
        const data = await storefrontApiRequest(PRODUCT_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        } else {
          toast.error("Produit introuvable");
          navigate('/store');
        }
      } catch (error) {
        logger.error('Error fetching product:', error, 'PAGE');
        toast.error("Erreur de chargement");
        navigate('/store');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [handle, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.variants.edges[selectedVariantIndex].node;
    const shopifyProduct: ShopifyProduct = { node: product };
    
    const cartItem = {
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    
    toast.success("Ajouté au panier ✨", {
      description: product.title,
      position: "top-center"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex].node;
  const mainImage = product.images.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Header unifié */}
      <GlobalHeader />

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted/30">
                {mainImage ? (
                  <img
                    src={mainImage.url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-24 w-24 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </Card>

            {/* Gallery thumbnails si plusieurs images */}
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.edges.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-muted/30 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition">
                    <img src={img.node.url} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(selectedVariant.price)}
                </span>
                {selectedVariant.availableForSale && (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    En stock
                  </Badge>
                )}
              </div>
            </div>

            <div 
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(product.description || '', {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h3', 'h4'],
                  ALLOWED_ATTR: []
                })
              }}
            />

            {/* Variants si présents */}
            {product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  {product.options[0].name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((variant, idx) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === idx ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVariantIndex(idx)}
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={!selectedVariant.availableForSale}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>

              <Card className="bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Accès Digital Inclus</p>
                      <p className="text-sm text-muted-foreground">
                        Chaque produit débloque un module exclusif sur EmotionsCare
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
