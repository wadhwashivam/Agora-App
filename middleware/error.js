async function errorHandler(err, req, res, next) {
    console.log(err);

    if (err.code === "P2002"){
        return res.status(409).json({ message: "Username already exists." });
    } else if (err.code === "P2025"){
        return res.status(404).json({ message: "User Profile not found."});
    } else if(err.code === "P2003"){
        return res.status(404).json({message: "Referenced resource not found."});
    } else{
        return res.status(500).json({
            message: "Something went wrong.",
            ...(process.env.NODE_ENV !== "production" && { errors: err.message })
        });
    }
}

export default errorHandler;