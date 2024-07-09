import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import paypal from 'paypal-rest-sdk';
import { Payment } from "../models/payment.model.js";

paypal.configure({
    'mode' : process.env.PAYPAL_MODE,
    'client_id' : process.env.PAYPAL_CLIENT_ID,
    'client_secret' : process.env.PAYPAL_SECRET_ID,
});

const processPaymentThroughPayPal = asyncHandler(async(req, res)=>{
    const { items, total, currency } = req.body;

    const itemList = items.map(item => ({
        "name": item.name,
        "sku": item.sku,
        "price": item.price,
        "currency": currency,
        "quantity": item.quantity
    }));

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": itemList
            },
            "amount": {
                "currency": currency,
                "total": total
            },
            "description": "Payment is being made by the customer"
        }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.log(error);
            return res
            .status(500)
            .json(500, "Error occurred creating payment", error)
        } else {
            req.session.paymentId = payment.id;
            req.session.total = total;
            req.session.currency = currency;

            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ forwardLink: payment.links[i].href });
                }
            }
        }
    });
})

const paymentSuccess = asyncHandler(async()=>{
    const payerId = req.query.PayerID;
    const paymentId = req.session.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": req.session.currency,
                "total": req.session.total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment)=>{
        if(error) {
            return res
            .status(500)
            .json(
            new ApiResponse(500, "Error occured executing the payment")
            )
        }
        else{
            const saleId = payment.transactions[0].related_resources[0].sale.id;

            const paymentDetails = await Payment.create({
                paymentId: payment.id,
                payerId: payerId,
                amount: payment.transactions[0].amount.total,
                currency: payment.transactions[0].amount.currency,
                paymentMethod: payment.payer.payment_method,
                state: payment.state,
                createTime: payment.create_time,
                updateTime: payment.update_time,
                salesId: salesId
            })

            if(!paymentDetails){
                return res
                .status(500)
                .json(
                    new ApiResponse(500, "Error creating payment")
                )
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, "Payment Successful", paymentDetails)
            )
        }
    })


})

const paymentCancelled = asyncHandler(async()=>{
    return res
    .status(400)
    .json(
        new ApiResponse(400, "Payment cancelled")
    )
});

const refundFullPayment = asyncHandler(async(req, res)=>{
    const {paymentId} = req.body

    const paymentDetails = await Payment.findOne({paymentId: paymentId})

    if(!paymentDetails){
        throw new ApiError(404, "Payment Details not found")
    }

    const salesId = paymentDetails.salesId

    const refund = {
        amount: {
            currency: paymentDetails.currency,
            total: paymentDetails.amount
        }
    }

    paypal.sale.refund(salesId, refund, (error, refund)=>{
        if(error){
            throw new ApiError(500, "Error occurred while refunding transaction", error);
        }
        else{
            return res
            .status(200)
            .json(
                new ApiResponse(200, "Amount Refunded Successfully", refund)
            )
        }
    })
})

const refundPartialPayment = asyncHandler(async(req, res)=>{
    const {paymentId, amount} = req.body

    const paymentDetail = await Payment.findOne({paymentId: paymentId})

    if(!paymentDetail){
        throw new ApiError(404, "Error occurred while getting payment details")
    }

    const salesId = paymentDetail.salesId

    const partialRefund = {
        amount: {
            currency: paymentDetail.currency,
            total: amount
        }
    }

    paypal.sale.refund(salesId, partialRefund, (error, partialRefund) => {
        if(error){
            throw new ApiError(500, "Error occured while processing the partial refund request", error);
        }
        else{
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200, "Partial Refund successfully processed", partialRefund
                )
            )
        }
    })
})

const getPaymentDetails = asyncHandler(async(req, res)=>{
    const paymentId = req.params.paymentId || req.body

    const PaymentDetails = await Payment.findById(paymentId)

    if(!paymentDetails) {
        throw new ApiError(404, "Payment Details not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Payment Details fetched successfully", PaymentDetails)
    )
})






export{
    processPaymentThroughPayPal,
    paymentSuccess,
    paymentCancelled,
    refundFullPayment,
    refundPartialPayment,
    getPaymentDetails
}