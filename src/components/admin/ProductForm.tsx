
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

const categories = [
  'skincare',
  'makeup-beauty',
  'jewelry',
  'perfumes',
  'supplements',
  'hair-wigs'
];

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { createProduct, updateProduct, loading } = useAdminProducts();
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    image: product?.image || '',
    category: product?.category || '',
    brand: product?.brand || '',
    rating: product?.rating || 0,
    reviews_count: product?.reviews_count || 0,
    is_on_sale: product?.is_on_sale || false,
    ingredients: product?.ingredients || '',
    how_to_use: product?.how_to_use || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image URL is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Submitting form data:', formData);
    
    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      image: formData.image.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      rating: Number(formData.rating),
      reviews_count: Number(formData.reviews_count),
      is_on_sale: formData.is_on_sale,
      ingredients: formData.ingredients.trim() || null,
      how_to_use: formData.how_to_use.trim() || null
    };

    console.log('Processed product data:', productData);

    let result;
    if (product) {
      result = await updateProduct(product.id, productData);
    } else {
      result = await createProduct(productData);
    }

    console.log('Result:', result);

    if (result.error === null && onSuccess) {
      onSuccess();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name - Required */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter product name"
              required
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Image URL - Required */}
          <div>
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">
              Product Image URL *
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
              className={`mt-1 ${errors.image ? 'border-red-500' : ''}`}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Rating - Required */}
          <div>
            <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
              Rating (0-5) *
            </Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => handleChange('rating', e.target.value)}
              placeholder="4.5"
              required
              className={`mt-1 ${errors.rating ? 'border-red-500' : ''}`}
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Product description..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Ingredients - Optional */}
          <div>
            <Label htmlFor="ingredients" className="text-sm font-medium text-gray-700">
              Ingredients (Optional)
            </Label>
            <Textarea
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => handleChange('ingredients', e.target.value)}
              placeholder="List of ingredients..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* How to Use - Optional */}
          <div>
            <Label htmlFor="how_to_use" className="text-sm font-medium text-gray-700">
              How to Use (Optional)
            </Label>
            <Textarea
              id="how_to_use"
              value={formData.how_to_use}
              onChange={(e) => handleChange('how_to_use', e.target.value)}
              placeholder="Instructions on how to use the product..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                Brand *
              </Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Brand name"
                required
                className={`mt-1 ${errors.brand ? 'border-red-500' : ''}`}
              />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>
            
            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className={`mt-1 ${errors.category ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price (₦) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="10000"
                required
                className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            {/* Original Price */}
            <div>
              <Label htmlFor="original_price" className="text-sm font-medium text-gray-700">
                Original Price (₦)
              </Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => handleChange('original_price', e.target.value)}
                placeholder="15000"
                className="mt-1"
              />
            </div>
            
            {/* Reviews Count */}
            <div>
              <Label htmlFor="reviews_count" className="text-sm font-medium text-gray-700">
                Reviews Count
              </Label>
              <Input
                id="reviews_count"
                type="number"
                min="0"
                value={formData.reviews_count}
                onChange={(e) => handleChange('reviews_count', e.target.value)}
                placeholder="50"
                className="mt-1"
              />
            </div>
          </div>

          {/* On Sale Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_on_sale"
              checked={formData.is_on_sale}
              onChange={(e) => handleChange('is_on_sale', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_on_sale" className="text-sm font-medium text-gray-700">
              Product is on sale
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
