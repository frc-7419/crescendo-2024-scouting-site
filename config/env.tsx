import {z, ZodFormattedError} from 'zod';

const schema = z.object({
    NEXTAUTH_SECRET: z.string().min(1),
    BLUEALLIANCE_API_KEY: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().min(1),
    CRON_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
});

const formatErrors = (errors: ZodFormattedError<any>) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if (value && '_errors' in value && Array.isArray(value._errors)) { // Check if _errors is an array
                return `${name}: ${value._errors.join(', ')}\n`;
            }
            return null;
        })
        .filter(Boolean);

const env = schema.safeParse(process.env);

if (!env.success) {
    console.error('Invalid environment variables:\n', ...formatErrors(env.error.format()));
    throw new Error('Invalid environment variables');
}

export default env.data;