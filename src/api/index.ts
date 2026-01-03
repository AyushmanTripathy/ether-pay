import env from "@/env";
import { razorpay } from "@/utils/razorpay";
import { Hono } from "hono";
import type { Context } from "hono";
import z from "zod";
import { sendEth } from "@/eth";

const router = new Hono()

const bodySchema = z.strictObject({
  walletId: z.string().nonempty(),
  amount: z.number().min(1).nonoptional(),
  origin: z.string().nonempty(),
})

router.post("/upi", async (c: Context) => {
  const body = await c.req.json()
  bodySchema.parse(body)

  const uuid = Bun.randomUUIDv7()
  const payment = await razorpay.paymentLink.create({
    accept_partial: false,
    upi_link: false,
    callback_method: "get",
    callback_url: `${body.origin}/capture`,
    reference_id: uuid,
    // 3% convinence fee
    amount: body.amount * 100,
    currency: "INR",
    description: `Payment request`,
    notify: {
      sms: false,
      email: false,
    },
    notes: {
      walletId: body.walletId,
    },
  })

  return c.json({
    link: payment.short_url,
  })
})

const captureSchema = z.strictObject({
  linkId: z.string().nonempty(),
})

router.post("/upi/capture", async (c: Context) => {
  const body = await c.req.json()
  captureSchema.parse(body)

  const payment = await razorpay.paymentLink.fetch(body.linkId)
  const walletId = payment.notes?.walletId
  if (!walletId)
    return c.text("wallet id not found", 400)
  const amount = Math.floor(payment.amount_paid / 100)

  console.log("Captured payment of", amount, "for walletId", walletId)

  try {
    const transactionHash = await sendEth(String(walletId), amount)
    return c.json({
      success: true,
      walletId,
      transactionHash,
    })
  } catch(e: any) {
    return c.json({
      success: false,
      walletId,
    })
  }
})

export default router;
