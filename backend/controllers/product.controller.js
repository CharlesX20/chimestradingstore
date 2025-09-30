import { redis } from "../lib/redis.js";
import cloudinary  from "../lib/cloudinary.js";

import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({}); //find all products
        res.json({ products });
    }catch(error){
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getFeaturedProducts = async (req, res) => {
    try{
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }

        //if not in redis, fetch from mongodb
        //lean is going to return a plain javascript object instead of a mongodb document which is good for performance
        featuredProducts = await Product.find({isFeatured:true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message: "No featured products found"});
        }

        //store in redis for future quick access
         await redis.set("featured_products", JSON.stringify(featuredProducts));

         res.json(featuredProducts);

    }catch(error){
        console.log("Error in getFeaturedProducts controller", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });

    // clear featured cache so newly-created featured product won't be missed
    try {
      await redis.del("featured_products");
    } catch (err) {
      console.log("Error clearing featured_products cache after create:", err.message || err);
    }

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete cloudinary image if any (keep your logic)
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (err) {
        console.log("error deleting image from cloudinary", err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    // invalidate featured products cache so frontend doesn't get stale list
    try {
      await redis.del("featured_products");
    } catch (err) {
      console.log("Error clearing featured_products cache after delete:", err.message || err);
      // do not fail the request if redis fails — deletion in DB succeeded
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If a new image was provided and it's different from the existing URL,
    // and it looks like a base64 payload (or not an http url) -> upload to Cloudinary.
    let finalImageUrl = product.image ?? null;

    const isBase64 =
      typeof image === "string" &&
      image.length > 200 &&
      !image.startsWith("http") &&
      image.includes(";base64,") === false; // or more relaxed heuristics

    // If they sent a base64 data uri already (startsWith data:) or raw base64
    if (typeof image === "string" && image.startsWith("data:")) {
      // upload data URI directly
      const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
      // optional: delete old image from cloudinary if it exists and isn't the same
      if (product.image && product.image.includes("res.cloudinary.com")) {
        try {
          const publicId = product.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err) {
          console.warn("failed to delete previous cloudinary image", err.message || err);
        }
      }
      finalImageUrl = cloudinaryResponse.secure_url;
    } else if (isBase64) {
      // raw base64 (no data: prefix) -> prefix and upload
      const dataUri = `data:image/jpeg;base64,${image}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(dataUri, { folder: "products" });
      if (product.image && product.image.includes("res.cloudinary.com")) {
        try {
          const publicId = product.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err) {
          console.warn("failed to delete previous cloudinary image", err.message || err);
        }
      }
      finalImageUrl = cloudinaryResponse.secure_url;
    } else if (typeof image === "string" && image && image !== product.image) {
      // image is a string but likely a new absolute URL (e.g., direct Cloudinary URL)
      finalImageUrl = image;
    }
    // else: image not provided or equals existing -> keep product.image

    // Update fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = typeof price !== "undefined" ? price : product.price;
    product.category = category ?? product.category;
    product.image = finalImageUrl ?? product.image;

    const updated = await product.save();

    // If you use a featured cache, you may want to update cache here
    // await updateFeaturedProductsCache();

    return res.json(updated);
  } catch (error) {
    console.error("Error in updateProduct controller", error.message || error);
    return res.status(500).json({ message: "Server error", error: error.message || error });
  }
};


export const getRecommendedProducts = async (req, res) => {
    try{
        const products = await Product.aggregate([
            {
                $sample: {size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])

        res.json(products);
    }catch(error){
        console.log("Error in getRecommendedProduct controller", error.message);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      // invalidate cache
      try {
        await redis.del("featured_products");
      } catch (err) {
        console.log("Error clearing featured_products cache after toggle:", err.message || err);
      }

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (err) {
    console.log("Error updating featured_products cache:", err.message || err);
  }
}


