const Listing = require("../models/listingModel");
const Image = require("../models/listingImage");
const User = require("../models/userModel")


exports.createListing = async (req, res) => {
  try {
    const { title, price, description, location, category } = req.body;
    const seller = req.user._id;

    // Ensure required fields
    if (!title || !price || !description || !location || !category ) {
      return res.status(400).json({ error: "All fields except image are required" });
    }

    // Only sellers can create listings
    if (req.user.role !== "seller") {
      return res.status(403).json({ error: "Only sellers can create listings" });
    }

    // Only verified users can create listings
    const user = await User.findById(seller);
    if (!user || !user.isVerified) {
      return res.status(403).json({ error: "Only verified users can create listings" });
    }

    // Handle images 
    let uploadedImages = [];
    if (req.files?.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const imageDoc = new Image({
            imageUrl: `/uploads/${file.filename}`, // later switch to Cloudinary/S3
            uploadedBy: seller,
          });
          return await imageDoc.save();
        })
      );
    }

    // Create listing
    const listing = new Listing({
      title,
      price,
      description,
      location,
      category,
      seller,
      images: uploadedImages.map((img) => img._id),
    });

    await listing.save();
    return res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error("CREATE LISTING ERROR:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

// Read all listings - GET

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("category", "name")
      .populate("location", "name")
      .populate("seller", "name email phone")
      .populate("images")
      .populate("slug")
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};


// Get single listing by slug - GET

// GET /listings/:slug
exports.getListingBySlug = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug })
      .populate("category", "name")
      .populate("location", "name")
      .populate("seller", "name email phone")
      .populate("images")
      .populate("slug")


    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json({ listing });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
};


// Update listing - PUT

// PUT /listings/:slug
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug }).populate("images");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (String(listing.seller) !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Only sellers can update listings
    if (req.user.role !== "seller") {
      return res.status(403).json({ error: "Only sellers can update listings" });
    }

    const { title, price, description, location, category, phone } = req.body;

    //  Handle image uploads with max 5 images limit
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const imageDoc = new Image({
            imageUrl: `/uploads/${file.filename}`,
            uploadedBy: req.user._id
          });
          return await imageDoc.save();
        })
      );

      // Push new images to the list
      listing.images.push(...uploadedImages.map(img => img._id));

      //  If more than 5 images, remove oldest ones
      if (listing.images.length > 5) {
        const excessCount = listing.images.length - 5;

        // Remove old image docs from DB
        const oldImages = listing.images.splice(0, excessCount);
        await Image.deleteMany({ _id: { $in: oldImages } });
      }
    }

    // Update other fields
    listing.title = title || listing.title;
    listing.price = price || listing.price;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.category = category || listing.category;
    listing.phone = phone || listing.phone;

    await listing.save();

    res.json({ message: "Listing updated", listing });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: "Failed to update listing" });
  }
};



// Delete listing - DELETE

// DELETE /listings/:slug
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ slug: req.params.slug })

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (String(listing.seller) !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // check if user is seller before uploading listing
    if (req.user.role !== "seller") {
      return res.status(403).json({ error: "Only sellers can create listings" });
    }

    // await listing.deleteOne();
     listing.isDeleted = true;  // soft delete 
     await listing.save();
    res.json({ message: "Listing deleted" });
  } catch (err) {
    console.log("Error:",err)
    res.status(500).json({ error: "Failed to delete listing" });
  }
};