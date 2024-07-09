import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activitylog.model.js";
import { Coupon } from "../models/coupon.model.js";

const getSalesOverview = asyncHandler(async (req, res) => {
  const sales = await Order.find({ status: "Delivered" });

  if (!sales) {
    throw new ApiError(404, "Sales overview not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Sales overview fetched successfully", sales));
});

const getSalesByDate = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  const salesByDate = await Order.find({
    date: date,
    status: "Delivered",
  });

  if (!salesByDate) {
    throw new ApiError(500, "Error while fetching sales of " + date, error);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, `Sales of ${date} fetched successfully`, salesByDate)
    );
});

const getSalesByProduct = asyncHandler(async (req, res) => {
  const { product } = req.body;

  if (!product) {
    throw new ApiError(400, "Product is required");
  }

  const salesByProduct = await Order.find({
    productTitle: product,
    status: "Delivered",
  });

  if (!salesByProduct) {
    throw new ApiError(500, `Error while getting sales detail for ${product}`);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Sales report of ${product} retrieved successfully`,
        salesByProduct
      )
    );
});

const getSalesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.body;
  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const salesByCategory = await Order.find({
    category: category,
    status: "Delivered",
  });

  if (!salesByCategory) {
    throw new ApiError(
      500,
      `Sales of ${category} category is not available`,
      error
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Sales of ${category} category retrieved successfully`,
        salesByCategory
      )
    );
});

const getSalesByRegion = asyncHandler(async (req, res) => {
  const { region } = req.body;

  if (!region) {
    throw new ApiError(400, "Region is required");
  }

  const salesByRegion = await Order.find({
    address: city,
    status: "Delivered",
  });

  if (!salesByRegion) {
    throw new ApiError(
      400,
      `Sales Report of ${region} is not available`,
      error
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Sales Report of ${region} retrieved successfully`,
        salesByRegion
      )
    );
});

const getCustomerActivity = asyncHandler(async (req, res) => {
  const { customerEmail } = req.body;

  const user = await User.find({ emailAddress: customerEmail });

  if (!user) {
    throw new ApiError(404, "User not found", error);
  }

  const activity = await ActivityLog.find({
    user: user._id,
  });

  if (!activity) {
    throw new ApiError(404, "Activity not found", error);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Activity of ${user.firstName} retrieved successfully`
      )
    );
});

const getTopSellingProducts = asyncHandler(async (req, res) => {
  try {
    const topSellingProdctPipeline =
      await Order.aggregate[
        ({ $match: { status: "Delivered" } },
        {
          $unwind: "$orderItem",
        },
        {
          $group: {
            _id: "$orderItem.productId",
            totalQuantitySold: { $sum: "orderItem.quantity" },
          },
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 20 })
      ];

    if (getTopSellingProducts.length == 0) {
      return res
        .status(300)
        .json(new ApiResponse(300, "There are no orders available", null));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Top Selling Products Data retrieved",
          topSellingProdctPipeline
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching top selling products", error);
  }
});

const getInventoryAnalysis = asyncHandler(async (req, res) => {

  const inventoryAnalysis =
    await Invetory.aggregate[
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productName" },
          totalQuantityAvailable: { $sum: "$quantityAvailable" },
          totalQuantitySold: { $sum: "$quantitySold" },
          totalQuantityReserved: { $sum: "$quantityReserved" },
          averagePrice: { $avg: "$price" },
          averageCostPrice: { $avg: "$costPrice" },
          reorderPoint: { $avg: "$reorderPoint" },
          reorderQuantity: { $avg: "$reorderQuantity" },
          minExpiryDate: { $min: "$expiryDate" },
          maxExpiryDate: { $max: "$expiryDate" },
        },
      }
    ];

    if(inventoryAnalysis.length == 0){
        return res
        .status(300)
        .json(
            new ApiResponse(300, "No Inventory Analysis Available", null)
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Inventory Analysis fetched", inventoryAnalysis)
    )
});

const getMarketingCampaignPerformance = asyncHandler(async (req, res) => {
    const marketingAnalysis = await Coupon.aggregate[
        {
            $group: {
                _id: "$couponId",
                type: "$couponType",
                couponCode: "$couponCode",
                usgaeCount: {$sum: "$usgaeCount"}
            },
            $sort: {usgaeCount: -1}
        }
    ]

    if(marketingAnalysis.length ==0){
        return res.status(300).json(new ApiResponse(300, "No marketing campaign data found", null))
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Marketing campaign data retrieved successfully", marketingAnalysis)
    )
});


export {
  getSalesOverview,
  getSalesByDate,
  getSalesByProduct,
  getSalesByCategory,
  getSalesByRegion,
  getCustomerActivity,
  getTopSellingProducts,
  getInventoryAnalysis,
  getMarketingCampaignPerformance,
};
