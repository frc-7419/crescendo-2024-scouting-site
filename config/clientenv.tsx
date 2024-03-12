import {z, ZodFormattedError} from 'zod';

const cenv = {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};

const clientSchema = z.object({
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
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

const clientEnv = clientSchema.safeParse(cenv);


if (!clientEnv.success) {
    console.error('Invalid client environment variables:\n', ...formatErrors(clientEnv.error.format()));
    throw new Error('client Invalid environment variables');
}
export default clientEnv.data;