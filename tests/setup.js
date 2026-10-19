import { config } from "dotenv";

config({ path: ".env.test", quiet: true});

const url = process.env.DATABASE_URL;

if(!url || !url.includes("agora_test")){
    throw new Error(
        `Refusing to run tests: DATABASE_URL must be agora_test, got "${url}"`
    );
}