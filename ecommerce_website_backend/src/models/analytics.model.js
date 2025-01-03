import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    pageViews: {
        url: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    sessions: {
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    clicks: {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    addToCart : {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    purchases : {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    completedOrders : {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    search: {
        searchTerm: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    subscriptionCount: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Subscription",
        required: true
    },
    salesData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    productPerformance: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        views: {
            type: Number,
            required: true
        },
        addToCart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: true
        },
        purchase: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        revenueGenerated: {
            type: Number,
            required: true
        },
        averageOrderValue: {
            type: Number,
            required: true
        }
    },
    caegoryPerformance: {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        views: {
            type: Number,
            required: true
        },
        purchase: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        revenueGenerated: {
            type: Number,
            required: true
        },
        averageOrderValue: {
            type: Number,
            required: true
        }
    },
    trafficSource: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        source: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        }
    },
    userDemographics: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userAge: {
            type: Number
        },
        userGender: {
            type: String
        },
        userLocation: {
            type: String
        },
        deviceType: {
            type: String
        }
    },
    userEngagement: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bounceRate: {
            type: Number,
            required: true
        },
        averageSessionDuration: {
            type: Number,
            required: true
        },
        pagesPerSession: {
            type: Number,
            required: true
        }
    },
    sellerPerformance: {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true
        },
        totalSale: {
            type: Number,
            required: true
        },
        profit: {
            type: Number,
            required: true
        }
    }
})

export const Analytics = mongoose.model("Analytics", analyticsSchema)