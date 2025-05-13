
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  stock: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Diffuseur d\'huiles essentielles',
    description: 'Diffuseur d\'aromathérapie pour un environnement apaisant',
    price: 39.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1595984108622-9dfa6607ef64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'aromathérapie',
    stock: 15
  },
  {
    id: '2',
    name: 'Coussin de méditation',
    description: 'Coussin ergonomique pour des séances de méditation confortables',
    price: 29.99,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'méditation',
    stock: 8
  },
  {
    id: '3',
    name: 'Casque de relaxation',
    description: 'Casque antibruit avec sons apaisants intégrés',
    price: 89.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'audio',
    stock: 5
  },
  {
    id: '4',
    name: 'Bracelet anti-stress',
    description: 'Bracelet mesurant le niveau de stress et vous aidant à le gérer',
    price: 49.99,
    rating: 3.9,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'accessoires',
    stock: 20
  },
  {
    id: '5',
    name: 'Set d\'huiles essentielles',
    description: 'Collection de 6 huiles essentielles pour différentes ambiances',
    price: 34.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'aromathérapie',
    stock: 12
  },
  {
    id: '6',
    name: 'Livre de bien-être',
    description: 'Guide complet pour améliorer votre bien-être au quotidien',
    price: 19.99,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'livres',
    stock: 30
  }
];

const MarketplacePage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{productId: string, quantity: number}[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  
  const categories = ['tous', 'aromathérapie', 'méditation', 'audio', 'accessoires', 'livres'];
  
  const filteredProducts = products.filter(product => 
    (activeCategory === 'tous' || product.category === activeCategory) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const addToCart = (productId: string) => {
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      // Augmenter la quantité
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Ajouter un nouvel élément
      setCart([...cart, { productId, quantity: 1 }]);
    }
    
    toast({
      title: "Produit ajouté au panier",
      description: "Votre article a été ajouté au panier avec succès",
    });
  };
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketplace Bien-être</h1>
            <p className="text-muted-foreground">
              Découvrez notre sélection de produits pour votre bien-être mental et physique
            </p>
          </div>
          
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des produits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full sm:w-auto overflow-auto"
          >
            <TabsList className="inline-flex w-auto">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="aspect-w-16 aspect-h-10 overflow-hidden rounded-t-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-[200px]"
                />
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{product.price.toFixed(2)} €</span>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                  <Badge variant={product.stock > 10 ? "secondary" : product.stock > 0 ? "outline" : "destructive"} className="ml-2">
                    {product.stock > 10 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock}` : 'Rupture'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketplacePage;
