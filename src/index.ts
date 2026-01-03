import router from "@/api/index"
import env from "@/env"
import { serve } from "bun"
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono()
app.notFound((c) => c.text("Route not found"));

app.use("*", cors({
  origin: '*',
}))

app.get("/health", (c) => c.text("Surviving Bro!"));
app.route("/api", router)

const server = serve({
  port: env.PORT,
  fetch: app.fetch,
})

console.info("Server listening on", env.PORT)
