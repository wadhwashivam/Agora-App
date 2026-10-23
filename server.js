import "dotenv/config"
import app from "./app.js";

app.listen(process.env.PORT, (error) => {
    if(error){
        throw error;
    }
    console.log("Listening on port: ", process.env.PORT);
})