const checkAuth = (req, res, next) => {
    console.log("checkAuth");

    next()
}

export default checkAuth;