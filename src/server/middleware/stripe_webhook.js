import orderServicers from "@/core/order"
import { stripeEventsHook } from "@/core/payment/stripe"
import { HttpStatus } from "@server/utils/status"
import express from "express"

function stripeMiddleware(req, res) {
  const signature = req.get("stripe-signature")
  if (!signature) {
    res.JSON(HttpStatus.BadRequest)
    return
  }
  const event = req.body
  if (!event) {
    res.JSON(HttpStatus.BadRequest)
    return
  }
  stripeEventsHook(event, createStripeOrder)
  res.json({ received: true })
}

async function createStripeOrder(m) {
  const order = orderServicers.orderPayment(
    m.collectionId ? "collection" : "cart",
    {
      userId: m.userId,
      collectionId: m.collectionId
    }
  )
  await order.stripe()
}

export function stripeWebhook(app) {
  app.use("/stripe-webhook", express.json(), stripeMiddleware)
}
