# Product Management Guide

## How to Add New Products

### 📝 Method 1: Edit JSON File (Recommended)

1. **Open the file**: `data/product.json`
2. **Add a new product object** to the `products` array
3. **Follow the structure** below
4. **Save the file** - changes appear immediately on the website

### 🏗️ Product Structure

```json
{
  "id": 10,
  "title": "Your Product Title",
  "description": "Detailed description of your calligraphy artwork",
  "price": 299,
  "originalPrice": 399,
  "image": "/images/gallery/your-image.jpg",
  "images": [
    "/images/gallery/your-image.jpg",
    "/images/gallery/your-image-detail.jpg"
  ],
  "category": "Religious",
  "dimensions": "60cm x 40cm",
  "medium": "Gold leaf on canvas",
  "style": "Traditional",
  "inStock": true,
  "featured": false,
  "tags": ["your", "tags", "here"],
  "rating": 5,
  "reviews": 0,
  "shippingWeight": "2.5kg",
  "framed": true,
  "customizable": true
}
```

### 📋 Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | number | Unique product identifier | `10` |
| `title` | string | Product name | `"Surah Al-Ikhlas"` |
| `description` | string | Detailed product description | `"Beautiful calligraphy..."` |
| `price` | number | Current selling price | `299` |
| `originalPrice` | number | Original price (for discounts) | `399` |
| `image` | string | Main product image path | `"/images/gallery/khat1.jpg"` |
| `images` | array | All product images | `["/images/gallery/khat1.jpg"]` |
| `category` | string | Product category | `"Religious"` or `"Contemporary"` |
| `dimensions` | string | Artwork size | `"60cm x 40cm"` |
| `medium` | string | Art materials used | `"Gold leaf on canvas"` |
| `style` | string | Artistic style | `"Traditional"` or `"Modern"` |
| `inStock` | boolean | Availability | `true` or `false` |
| `featured` | boolean | Featured product | `true` or `false` |
| `tags` | array | Searchable keywords | `["surah", "gold", "traditional"]` |
| `rating` | number | Average rating (1-5) | `5` |
| `reviews` | number | Number of reviews | `12` |
| `shippingWeight` | string | Package weight | `"2.5kg"` |
| `framed` | boolean | Includes frame | `true` or `false` |
| `customizable` | boolean | Can be customized | `true` or `false` |

### 🖼️ Image Requirements

1. **Main Image**: Use as the primary product image
2. **Image Paths**: Place images in `/public/images/gallery/`
3. **Supported Formats**: JPG, PNG, WebP
4. **Recommended Size**: 800x800px or larger
5. **Aspect Ratio**: Square (1:1) works best

### 🏷️ Categories and Styles

**Available Categories:**
- `"Religious"` - Islamic calligraphy and religious texts
- `"Contemporary"` - Modern artistic interpretations

**Available Styles:**
- `"Traditional"` - Classical Islamic calligraphy
- `"Modern"` - Contemporary artistic styles

### 📝 Step-by-Step Example

1. **Prepare your images** and place them in `/public/images/gallery/`
2. **Open** `data/product.json`
3. **Find the products array** and add a new object
4. **Use the next available ID** (currently 10)
5. **Fill in all required fields**
6. **Save the file** - changes appear immediately!

### 🔄 Updating Existing Products

To update an existing product:
1. Find the product by `id` in the JSON file
2. Modify the desired fields
3. Save the file
4. The changes will appear immediately on the website

### 🗑️ Removing Products

To remove a product:
1. Delete the entire product object from the JSON file
2. Update the category counts if needed
3. Save the file

### ⚠️ Important Notes

- **Unique IDs**: Each product must have a unique `id`
- **Image Paths**: Ensure image paths are correct and files exist
- **JSON Format**: Maintain valid JSON syntax (commas, brackets)
- **Category Counts**: Update category counts when adding/removing products
- **Backup**: Always backup the JSON file before making changes
- **No Server Restart**: Changes appear immediately after saving the file

### 🚀 Advanced Features

The shop page includes:
- **Search functionality** (searches title, description, and tags)
- **Category filtering**
- **Style filtering**
- **Price sorting** (low to high, high to low)
- **Rating sorting**
- **Featured product highlighting**
- **Stock status indicators**

### 📱 Product Display

Products are displayed with:
- Product image with featured/out-of-stock badges
- Title and description
- Price with original price (if discounted)
- Product details (size, medium, rating)
- Add to cart and view details buttons

### 🔧 Troubleshooting

**Product not appearing:**
- Check JSON syntax for errors
- Verify image paths exist
- Ensure unique product ID

**Images not loading:**
- Check file paths in `/public/images/gallery/`
- Verify file names match exactly
- Ensure files are valid image formats

**Filtering not working:**
- Check category and style values match exactly
- Verify tags are properly formatted as arrays

**JSON Import Issues:**
- The shop page now imports product data directly as a module
- No fetch requests are made, so network issues are eliminated
- Changes to the JSON file appear immediately after saving

### 📝 Method 2: Import JSON File (Alternative)

1. **Prepare your JSON file** with the product data
2. **Import the JSON file** into the product module
3. **Save the file** - changes appear immediately on the website

### 🔄 Updating Existing Products

To update an existing product:
1. Find the product by `id` in the JSON file
2. Modify the desired fields
3. Save the file
4. The changes will appear immediately on the website

### 🗑️ Removing Products

To remove a product:
1. Delete the entire product object from the JSON file
2. Update the category counts if needed
3. Save the file

### ⚠️ Important Notes

- **Unique IDs**: Each product must have a unique `id`
- **Image Paths**: Ensure image paths are correct and files exist
- **JSON Format**: Maintain valid JSON syntax (commas, brackets)
- **Category Counts**: Update category counts when adding/removing products
- **Backup**: Always backup the JSON file before making changes
- **No Server Restart**: Changes appear immediately after saving the file

### 🚀 Advanced Features

The shop page includes:
- **Search functionality** (searches title, description, and tags)
- **Category filtering**
- **Style filtering**
- **Price sorting** (low to high, high to low)
- **Rating sorting**
- **Featured product highlighting**
- **Stock status indicators**

### 📱 Product Display

Products are displayed with:
- Product image with featured/out-of-stock badges
- Title and description
- Price with original price (if discounted)
- Product details (size, medium, rating)
- Add to cart and view details buttons

### 🔧 Troubleshooting

**Product not appearing:**
- Check JSON syntax for errors
- Verify image paths exist
- Ensure unique product ID

**Images not loading:**
- Check file paths in `/public/images/gallery/`
- Verify file names match exactly
- Ensure files are valid image formats

**Filtering not working:**
- Check category and style values match exactly
- Verify tags are properly formatted as arrays

**JSON Import Issues:**
- The shop page now imports product data directly as a module
- No fetch requests are made, so network issues are eliminated
- Changes to the JSON file appear immediately after saving

### 📝 Method 3: Manual Entry (Not Recommended)

1. **Manually enter product details** in the product module
2. **Save the product** - changes appear immediately on the website

### 🔄 Updating Existing Products

To update an existing product:
1. Find the product by `id` in the product module
2. Modify the desired fields
3. Save the product
4. The changes will appear immediately on the website

### 🗑️ Removing Products

To remove a product:
1. Delete the product from the product module
2. Save the product module
3. The changes will appear immediately on the website

### ⚠️ Important Notes

- **Unique IDs**: Each product must have a unique `id`
- **Manual Entry**: Manual entry is not recommended due to the risk of data inconsistency
- **No Server Restart**: Changes appear immediately after saving the product

### 🚀 Advanced Features

The shop page includes:
- **Search functionality** (searches title, description, and tags)
- **Category filtering**
- **Style filtering**
- **Price sorting** (low to high, high to low)
- **Rating sorting**
- **Featured product highlighting**
- **Stock status indicators**

### 📱 Product Display

Products are displayed with:
- Product image with featured/out-of-stock badges
- Title and description
- Price with original price (if discounted)
- Product details (size, medium, rating)
- Add to cart and view details buttons

### 🔧 Troubleshooting

**Product not appearing:**
- Check product module for errors
- Verify product ID
- Ensure product details are correctly entered

**Images not loading:**
- Check product module for image paths
- Verify image paths are correct
- Ensure product images are valid

**Filtering not working:**
- Check product module for category and style values
- Verify category and style values match exactly
- Ensure product details are correctly entered

**Manual Entry Issues:**
- Manual entry is not recommended due to the risk of data inconsistency
- Changes to product details appear immediately after saving the product
- No server restart is required 