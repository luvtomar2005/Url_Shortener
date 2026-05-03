const { z } = require("zod");

const EnvSchema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.string().min(1)
})
function loadEnv(){
    const parsed = EnvSchema.safeParse(process.env);
    if(!parsed.success){
        console.log("Invalid env:" , parsed.error.flatten().fieldErrors);
        process.exit(1);
    }
    return parsed.data;
}


module.exports = { loadEnv };


