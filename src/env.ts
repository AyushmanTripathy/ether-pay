const env = {
  PORT: Number(process.env.PORT),
  HOST: String(process.env.HOST),
  DATABASE_URL: String(process.env.DATABASE_URL),
  RCP_URL: String(process.env.RCP_URL),
  RAZORPAY_KEY_ID: String(process.env.RAZORPAY_KEY_ID),
  RAZORPAY_KEY_SECRET: String(process.env.RAZORPAY_KEY_SECRET),
  PRIVATE_KEY: String(process.env.PRIVATE_KEY),
}

for (const key of Object.keys(env)) {
  //@ts-ignore
  if (typeof process.env[key] == "undefined" || typeof env[key] == "undefined") {
    console.log("env", key, "is missing");
    process.exit(1);
  }
}

export default env;
