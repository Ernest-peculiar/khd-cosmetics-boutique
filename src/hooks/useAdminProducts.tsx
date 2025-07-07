import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type ProductInsert = Omit<Product, "id" | "created_at">;

export const useAdminProducts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createProduct = async (productData: ProductInsert) => {
    setLoading(true);
    console.log("Creating product with data:", productData);

    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating product:", error);
        throw error;
      }

      console.log("Product created successfully:", data);

      toast({
        title: "Product created!",
        description: `${productData.name} has been added successfully.`,
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: `Failed to create product: ${
          error instanceof Error ? error.message : "Please try again."
        }`,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: number,
    productData: Partial<ProductInsert>
  ) => {
    setLoading(true);
    console.log("Updating product with data:", { id, productData });

    try {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.error("No product found with id:", id);
          toast({
            title: "Error",
            description: `No product found with id: ${id}`,
            variant: "destructive",
          });
        } else {
          console.error("Supabase error updating product:", error);
          toast({
            title: "Error",
            description: `Failed to update product: ${
              error instanceof Error ? error.message : "Please try again."
            }`,
            variant: "destructive",
          });
        }
        throw error;
      }

      console.log("Product updated successfully:", data);

      toast({
        title: "Product updated!",
        description: "Product has been updated successfully.",
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: `Failed to update product: ${
          error instanceof Error ? error.message : "Please try again."
        }`,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    console.log("Deleting product with id:", id);

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Supabase error deleting product:", error);
        throw error;
      }

      console.log("Product deleted successfully");

      toast({
        title: "Product deleted!",
        description: "Product has been removed successfully.",
      });

      return { error: null };
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: `Failed to delete product: ${
          error instanceof Error ? error.message : "Please try again."
        }`,
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const productExists = async (id: number) => {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .single();
    return !!data && !error;
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    productExists,
  };
};
