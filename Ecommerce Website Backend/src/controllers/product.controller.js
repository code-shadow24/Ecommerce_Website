import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Category } from "../models/category.model.js";
import { Subcategory } from "../models/subcategory.model.js";
import { Tax } from "../models/tax.model.js";
import { fileDelete, fileUpload } from "../utils/fileUpload.js";
import { Rating } from "../models/ratings.model.js";
import { Variant } from "../models/productVariantModel.js";

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (products.length == 0) {
    return res.status(404).json(new ApiResponse(404, "No Product found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "All products retrieved successfully", products)
    );
});
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.productId || req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(500, "Error occured while retrieving product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Product retrieved successfully", product));
});
const createProduct = asyncHandler(async (req, res) => {
  const sellerId = req.params.sellerId || req.body.sellerId;

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const {
    productTitle,
    sizes,
    colors,
    originalPrice,
    discountedPrice,
    category,
    subCategory,
    description,
    stockKeepingUnit,
    barcode,
    weight,
    length,
    width,
    height,
    metaTitle,
    metaDescription,
    metaKeywords,
    taxName,
    modelNo,
    numberOfPieces,
    sizeChart,
    weightUnit,
    lengthUnit,
    widthUnit,
    heightUnit,
    capacity,
    capacityUnit,
    material,
    warranty,
    expiryDate,
  } = req.body;

  const requiredFields = [
    "productTitle",
    "originalPrice",
    "discountedPrice",
    "category",
    "description",
    "stockKeepingUnit",
    "barcode",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "material",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]?.trim()) {
      throw new ApiError(
        400,
        `${field.replace(/([A-Z])/g, " $1")} cannot be empty`
      );
    }
  }

  const categorySpecificFields = {
    "Food Item": ["expiryDate"],
    Grocery: ["expiryDate"],
    "Men Clothing": ["sizeChart", "sizes", "colors"],
    "Women Clothing": ["sizeChart", "sizes", "colors"],
    "Kids Clothing": ["sizeChart", "sizes", "colors"],
    Furniture: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    "Furniture Accessories": [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    Outdoor: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    "Home Decor": [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    Electronics: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
      "warranty",
      "modelNo",
    ],
  };

  if (categorySpecificFields[category]) {
    for (const field of categorySpecificFields[category]) {
      if (!req.body[field]?.trim()) {
        throw new ApiError(
          400,
          `${field.replace(/([A-Z])/g, " $1")} cannot be empty`
        );
      }
    }
  }

  if (subCategory === "Utensils") {
    if (!capacity?.trim() || !capacityUnit?.trim()) {
      throw new ApiError(400, "Capacity details cannot be empty");
    }
  }

  const categoryDetail = await Category.findOne({ categoryName: category });
  if (!categoryDetail) {
    throw new ApiError(404, "Category not found");
  }

  const subCategoryDetail = await Subcategory.findOne({
    subcategoryName: subCategory,
  });
  if (!subCategoryDetail) {
    throw new ApiError(404, "Sub Category not found");
  }

  let taxDetail;
  if (taxName) {
    taxDetail = await Tax.findOne({ name: taxName });
    if (!taxDetail) {
      throw new ApiError(404, "Tax not found");
    }
  }

  const productImages = req.files?.map((file) => file.path);
  const uploadedProductImages = productImages
    ? await fileUpload(productImages)
    : [];

  const newProduct = await Product.create({
    seller: seller._id,
    productTitle,
    sizes: sizes || [],
    sizeChart: sizeChart || [],
    colors: colors || [],
    originalPrice,
    discountedPrice,
    category: categoryDetail._id,
    subcategory: subCategoryDetail._id,
    productImage: uploadedProductImages.map((image) => image.url),
    description,
    stockKeepingUnit,
    barcode,
    weight: weight || null,
    dimensions: {
      length: length || null,
      lengthUnit: lengthUnit || null,
      width: width || null,
      widthUnit: widthUnit || null,
      height: height || null,
      heightUnit: heightUnit || null,
    },
    modelNo: modelNo || null,
    numberOfPieces: numberOfPieces || null,
    capacity: capacity || null,
    capacityUnit: capacityUnit || null,
    metaTitle,
    metaDescription,
    metaKeywords,
    tax: taxDetail?._id || null,
    material,
    warranty: warranty || null,
    expiryDate: expiryDate || null,
  });

  if (!newProduct) {
    throw new ApiError(500, "Error occurred while creating new product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "New product created successfully", newProduct));
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const {
    productTitle,
    sizes,
    colors,
    originalPrice,
    discountedPrice,
    category,
    subCategory,
    description,
    stockKeepingUnit,
    barcode,
    weight,
    length,
    width,
    height,
    metaTitle,
    metaDescription,
    metaKeywords,
    taxName,
    modelNo,
    numberOfPieces,
    sizeChart,
    weightUnit,
    lengthUnit,
    widthUnit,
    heightUnit,
    capacity,
    capacityUnit,
    material,
    warranty,
    expiryDate,
  } = req.body;

  const requiredFields = [
    "productTitle",
    "originalPrice",
    "discountedPrice",
    "category",
    "description",
    "stockKeepingUnit",
    "barcode",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
    "material",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]?.trim()) {
      throw new ApiError(
        400,
        `${field.replace(/([A-Z])/g, " $1")} cannot be empty`
      );
    }
  }

  const categorySpecificFields = {
    "Food Item": ["expiryDate"],
    Grocery: ["expiryDate"],
    "Men Clothing": ["sizeChart", "sizes", "colors"],
    "Women Clothing": ["sizeChart", "sizes", "colors"],
    "Kids Clothing": ["sizeChart", "sizes", "colors"],
    Furniture: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    "Furniture Accessories": [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    Outdoor: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    "Home Decor": [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
    ],
    Electronics: [
      "weight",
      "length",
      "lengthUnit",
      "width",
      "widthUnit",
      "height",
      "heightUnit",
      "weightUnit",
      "warranty",
      "modelNo",
    ],
  };

  if (categorySpecificFields[category]) {
    for (const field of categorySpecificFields[category]) {
      if (!req.body[field]?.trim()) {
        throw new ApiError(
          400,
          `${field.replace(/([A-Z])/g, " $1")} cannot be empty`
        );
      }
    }
  }

  if (subCategory === "Utensils") {
    if (!capacity?.trim() || !capacityUnit?.trim()) {
      throw new ApiError(400, "Capacity details cannot be empty");
    }
  }

  const categoryDetail = await Category.findOne({ categoryName: category });
  if (!categoryDetail) {
    throw new ApiError(404, "Category not found");
  }

  const subCategoryDetail = await Subcategory.findOne({
    subcategoryName: subCategory,
  });
  if (!subCategoryDetail) {
    throw new ApiError(404, "Sub Category not found");
  }

  let taxDetail;
  if (taxName) {
    taxDetail = await Tax.findOne({ name: taxName });
    if (!taxDetail) {
      throw new ApiError(404, "Tax not found");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productTitle,
        sizes: sizes || [],
        sizeChart: sizeChart || [],
        colors: colors || [],
        originalPrice,
        discountedPrice,
        category: categoryDetail._id,
        subcategory: subCategoryDetail._id,
        description,
        stockKeepingUnit,
        barcode,
        weight: weight || null,
        dimensions: {
          length: length || null,
          lengthUnit: lengthUnit || null,
          width: width || null,
          widthUnit: widthUnit || null,
          height: height || null,
          heightUnit: heightUnit || null,
        },
        modelNo: modelNo || null,
        numberOfPieces: numberOfPieces || null,
        capacity: capacity || null,
        capacityUnit: capacityUnit || null,
        metaTitle,
        metaDescription,
        metaKeywords,
        tax: taxDetail?._id || null,
        material,
        warranty: warranty || null,
        expiryDate: expiryDate || null,
      },
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(500, "Error occurred while updating product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", updatedProduct));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId || req.body || req.query;

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  try {
    await fileDelete(existingProduct.productImage, false);
  } catch (error) {
    throw new ApiError(
      500,
      "Error occurred while deleting product images",
      error
    );
  }

  try {
    await Product.findByIdAndDelete(productId);
    return res
      .status(200)
      .json(new ApiResponse(200, "Product deleted successfully", null));
  } catch (error) {
    throw new ApiError(500, "Error occurred while deleting product", error);
  }
});
const getProductByCategory = asyncHandler(async (req, res) => {
  const category = req.query.category || req.body.category;

  if (!category || category.trim() === "") {
    throw new ApiError(400, "Category name is required");
  }

  const categoryDetail = await Category.findOne({ categoryName: category });
  if (!categoryDetail) {
    throw new ApiError(400, "Category not found");
  }

  const products = await Product.find({ category: categoryDetail._id })
    .populate("seller", "name")
    .populate("category", "categoryName")
    .populate("subcategory", "subcategoryName")
    .populate("tax", "name rate");

  if (products.length === 0) {
    throw new ApiError(400, "No products found in the requested category");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All the products from the requested category fetched successfully",
        products
      )
    );
});

const searchProducts = asyncHandler(async (req, res) => {
  const searchQuery = req.query || req.params || req.body;

  try {
    let filter = {};

    if (searchQuery.text) {
      filter.$or = [
        { productTitle: { $regex: searchQuery.text, $options: "i" } },
        { description: { $regex: searchQuery.text, $options: "i" } },
        { metaKeywords: { $regex: searchQuery.text, $options: "i" } },
      ];
    }

    if (searchQuery.category) {
      filter.category = searchQuery.category;
    }

    if (searchQuery.subCategory) {
      filter.subCategory = searchQuery.subCategory;
    }

    if (searchQuery.minPrice || searchQuery.maxPrice) {
      filter.discountedPrice = {};
      if (searchQuery.minPrice) {
        filter.discountedPrice.$gte = searchQuery.minPrice;
      }
      if (searchQuery.maxPrice) {
        filter.discountedPrice.$lte = searchQuery.maxPrice;
      }
    }

    if (searchQuery.sizes && searchQuery.sizes.length > 0) {
      filter.sizes = { $in: searchQuery.sizes };
    }

    if (searchQuery.colors && searchQuery.colors.length > 0) {
      filter.colors = { $in: searchQuery.colors };
    }

    const searchResult = await Product.find(filter);

    if (searchQuery.sortBy) {
      const sort = {};
      sort[searchQuery.sortBy] = searchQuery.sortOrder === "desc" ? -1 : 1;
      searchResult = searchResult.sort(sort);
    }

    if (searchQuery.limit) {
      searchResult = searchResult.limit(searchQuery.limit);
    }

    const products = await searchResult.exec();

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Searched product fetched successfully", products)
      );
  } catch (error) {
    throw new ApiError(500, "Error occured while fetching product", error);
  }
});

const getNewArrivalProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(20);

  if (!products) {
    throw new ApiError(
      500,
      "Error occured while fetching new Arrived Product",
      error
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "New Arrived Product fetched", products));
});
const getProductReviews = asyncHandler(async (req, res) => {
  const productId = req.params.productId || req.query.productId || req.body;

  const ratings = await Rating.find({ product: productId });

  if (ratings.length == 0) {
    return res.status(404).json(new ApiResponse(404, "No rating found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All ratings found", ratings));
});
const updateProductImage = asyncHandler(async (req, res) => {
  const productId =
    req.params.productId || req.query.productId || req.body.productId;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  try {
    if (
      existingProduct.productImage &&
      existingProduct.productImage.length > 0
    ) {
      await fileDelete(existingProduct.productImage, false);
    }
  } catch (error) {
    throw new ApiError(
      500,
      "Error occured while deleting product images",
      error
    );
  }

  const productImages = req.files?.map((file) => file.path);
  const uploadedProductImages = productImages
    ? await fileUpload(productImages)
    : [];

  const productImagesUpdate = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        productImage: uploadedProductImages.map((image) => image.url),
      },
    },
    { new: true }
  );

  if (!productImagesUpdate) {
    throw new ApiError(500, "Error Occured while updating product images");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Product Images updated successfully",
        productImagesUpdate
      )
    );
});
const getRelatedProducts = asyncHandler(async (req, res) => {
  const productId =
    req.params.productId || req.query.productId || req.body.productId;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: productId },
  });

  if (relatedProducts.length == 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No related Products Found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All Related Products Retrived Successfully",
        relatedProducts
      )
    );
});
const getProductVariants = asyncHandler(async (req, res) => {
    const productId = req.params.productId || req.query.productId || req.body.productId

    const variants = await Variant.find({productId: productId})

    if(!variants){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Variants for the product found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Product variants retrieved successfully", variants)
    )
});
const createProductVariants = asyncHandler(async (req, res) => {
    const productId = req.params.productId || req.query.productId || req.body.productId

    const product = await Product.findById(productId)

    const {productTitle, sizes, colors, originalPrice, discountedPrice} = req.body

    if(productTitle?.trim()==""){
      throw new ApiError("Product Title cannot be empty")
    }

    const variantImages = req.files?.map((file) =>file.path)
    const uploadVariantImage = variantImages ? await fileUpload(variantImages) : []

    const newVariant = await Variant.create({
      productId: productId,
      productTitle: productTitle || product.productTitle,
      sizes: sizes || null,
      colors: colors || null,
      originalPrice: originalPrice || product.originalPrice,
      discountPrice: discountedPrice || product.discountedPrice,
      productImage: uploadVariantImage.map((image)=> image.url) || null,
    })

    if(!newVariant){
      throw new ApiError(500, "Error occurred while creating new variant")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, "Product Variant Created Successfully", newVariant)
    )

});
const updateProductVariants = asyncHandler(async (req, res) => {
    const variantId = req.params.variantIdId || req.query.variantId || req.body.variantId

    const {productTitle, sizes, colors, originalPrice, discountedPrice} = req.body

    if(productTitle?.trim()==""){
      throw new ApiError("Product Title cannot be empty")
    }

    const updateVariant = await Variant.findByIdAndUpdate(
      variantId,
      {
        $set: {
          productTitle: productTitle,
          sizes: sizes || null,
          colors: colors || null,
          originalPrice: originalPrice || null,
          discountedPrice: discountedPrice || null
        }
      },
      {new: true}
    )

    if(!updateVariant){
      throw new ApiError(500, "Error occured while updating variant")
    }

    return res
    .status
});

const updateVariantImage = asyncHandler(async(req, res)=>{
  const variantId = req.params.variantIdId || req.query.variantId || req.body.variantId

  const existingVariant = await Variant.findById(variantId)

  if(!existingVariant){
    throw new ApiError(404, "Variant not found")
  }

  try {
    if(existingVariant.productImages && existingVariant.productImages.length>0){
      await fileDelete(existingVariant.productImages, false)
    }
  } catch (error) {
    throw new ApiError(500, "Error occured while deleting variant")
  }

  const productVariantImagesPath = req.files?.map((file)=>file.path)
  const productVariantImagesUpload = await fileUpload(productVariantImagesPath)

  const productVariantImagesUpdate = await Variant.findByIdAndUpdate(
    variantId,
    {
      $set: {
        productImages: productVariantImagesUpload.map((image)=>image.url) || null
      }
    },
    {new:true}
  )

  if(!productVariantImagesUpdate){
    throw new ApiError(500, "Product Variant Images Updated Successfully", productVariantImagesUpdate)
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Product Variant Images Updated Successfully", productVariantImagesUpdate)
  )
})
const deleteProductVariants = asyncHandler(async (req, res) => {
  const variantId = req.params.variantIdId || req.query.variantId || req.body.variantId

  const existingVariant = await Variant.findById(variantId)

  if(!existingVariant){
    throw new ApiError(500, "Error occured while retrieving variant")
  }

  try {
    if(!existingVariant.productImages && existingVariant.productImages.length > 0){
      await fileDelete(existingVariant.productImages, false)
    }
  } catch (error) {
    throw new ApiError(500, "Error occurred while deleting variant image", error)
  }

  try {
    await Variant.findByIdAndDelete(variantId)
    return res
    .status(200)
    .json(
      new ApiResponse(200, "Product Variant Deleted Successfully", null)
    )
  } catch (error) {
    throw new ApiError(500, "Error occurred while deleting product variant", error)
  }
});


export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory,
  searchProducts,
  getNewArrivalProducts,
  getProductReviews,
  updateProductImage,
  getRelatedProducts,
  getProductVariants,
  createProductVariants,
  updateProductVariants,
  updateVariantImage,
  deleteProductVariants,
};
