/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { z } from "zod";

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    ),
  }),
);

const EnvSchema = z.object({
  PORT_NO: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().min(1).max(65535),
  ),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  //   DATABASE_AUTH_TOKEN: z.string().optional(),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export default env!;
