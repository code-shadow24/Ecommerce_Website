import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {Shippo} from 'shippo'
import { sendEmail } from "../utils/emails/emailservice.js";

const API_TOKEN = process.env.SHIPPO_TOKEN;
const shippo = new Shippo(API_TOKEN);

const createShipment = asyncHandler(async (req, res) => {
    const { addressFrom, addressTo, parcel } = req.body;

    const shipment = await shippoClient.shipment.create({
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel],
    });

    if (!shipment) {
        throw new ApiError(500, "Error occurred while creating shipment");
    }

    const rates = await shippoClient.shipment.rates(shipment.object_id);
    const rate = rates.results[0];

    const transaction = await shippoClient.transaction.create({
        rate: rate.object_id,
        label_file_type: 'PDF',
        async: false,
        shipment: shipment.object_id,
        carrier_account: rate.carrier_account,
        address_to: addressTo,
    });

    if (!transaction) {
        throw new ApiError(500, "Error occurred while creating transaction");
    }

    const emailContent = {
        to: addressTo.email,
        subject: "Shipment Created",
        text: `Dear ${addressTo.name},
        PFA the shipping label for your order.
        
        ${transaction.label_url}
        
        Thank You for shopping with us.
        
        Thanks and Regards
        Infinite Pickings Team`
    };

    const emailSent = await sendEmail(emailContent);

    if (!emailSent) {
        throw new ApiError(500, "Error occurred while sending email");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Shipment created successfully", { transaction, emailSent })
        );
});

const cancelShipment = asyncHandler(async (req, res) => {
    const { transactionObjectId } = req.params;

    if (!transactionObjectId) {
        throw new ApiError(400, "Transaction Object Id is required");
    }

    const cancellation = await shippoClient.transaction.cancel(transactionObjectId);

    if (!cancellation) {
        throw new ApiError(500, "Error occurred while cancelling the shipment");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Shipment canceled successfully", cancellation)
        );
});

const trackShipment = asyncHandler(async (req, res) => {
    const { trackingNumber } = req.body || req.query || req.params;

    if (!trackingNumber) {
        throw new ApiError(400, "Tracking number is required");
    }

    const trackingInfo = await shippoClient.track.get(trackingNumber);

    if (!trackingInfo) {
        throw new ApiError(500, "Error occurred while getting tracking information");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Tracking information retrieved successfully", trackingInfo)
        );
});

const retrieveShippingLabel = asyncHandler(async (req, res) => {
    const { transactionObjectId } = req.params;

    if (!transactionObjectId) {
        throw new ApiError(400, "Transaction Object Id is required");
    }

    const shippingLabel = await shippoClient.transaction.label(transactionObjectId);

    if (!shippingLabel) {
        throw new ApiError(500, "Error occurred while getting shipping label");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Shipping Label Retrieved Successfully", shippingLabel)
        );
});

const validateShippingAddress = asyncHandler(async (req, res) => {
    const { address } = req.body;

    if (!address) {
        throw new ApiError(400, "Address is required");
    }

    const validAddress = await shippoClient.address.validate(address);

    if (!validAddress) {
        throw new ApiError(500, "Error occurred while validating address");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Address validated successfully", validAddress)
        );
});

const createReturnShipment = asyncHandler(async (req, res) => {
    const { originalTransactionId } = req.body || req.params;

    if (!originalTransactionId) {
        throw new ApiError(400, "Original transaction id is required");
    }

    const returnShipment = await shippoClient.transaction.createForReturn(originalTransactionId);

    if (!returnShipment) {
        throw new ApiError(500, "Error occurred while creating return shipment");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Return Shipment Created Successfully", returnShipment)
        );
});

export {
    createShipment,
    cancelShipment,
    trackShipment,
    retrieveShippingLabel,
    validateShippingAddress,
    createReturnShipment,
};
