import { z } from "zod";

const envSchmea = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().int().positive().default(8000),
  BCRYPT_PASSWORD: z.string(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive()
})

const result = envSchmea.safeParse(process.env)
if (!result.success) {
  console.log("error accessing environment variables")
  console.log(z.treeifyError(result.error))
  process.exit()
}

export const env = result.data
