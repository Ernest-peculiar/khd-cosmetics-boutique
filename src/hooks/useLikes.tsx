
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type UserLike = Tables<'user_likes'>;

export const useLikes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    } else {
      setLikedProducts([]);
      setLikedProductIds(new Set());
    }
  }, [user]);

  const fetchLikedProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_likes')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const products = data?.map(like => like.products).filter(Boolean) as Product[] || [];
      const productIds = new Set(products.map(p => p.id));
      
      setLikedProducts(products);
      setLikedProductIds(productIds);
    } catch (error) {
      console.error('Error fetching liked products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (product: Product) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like products",
      });
      return;
    }

    try {
      const isLiked = likedProductIds.has(product.id);

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;

        setLikedProducts(prev => prev.filter(p => p.id !== product.id));
        setLikedProductIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });

        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        // Like
        const { error } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;

        setLikedProducts(prev => [...prev, product]);
        setLikedProductIds(prev => new Set([...prev, product.id]));

        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLiked = (productId: number) => likedProductIds.has(productId);

  return {
    likedProducts,
    loading,
    toggleLike,
    isLiked,
    refetch: fetchLikedProducts,
  };
};
