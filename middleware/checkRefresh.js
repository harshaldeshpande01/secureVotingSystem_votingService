const jwt = require("jsonwebtoken");

const verifyOptions = {
  expiresIn: process.env.REFRESH_EXPIRE,
  algorithms: ["RS256"]
}

exports.checkRefreshToken = async (req, res, next) => {
  let token;
  console.log(req.headers.authorization)

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log(1)
    return res.status(401).send("Not authorized to access this router");
  }

  try {
    const decoded = jwt.verify(
      token, 
      Buffer.from(process.env.REFRESH_PUBLIC , 'base64').toString('ascii'),
      verifyOptions
    );
    console.log(decoded)
    if(decoded) {
        req.uid = decoded.id;
        req.uemail = decoded.email
        next();
    }
    else {
        console.log(2)
      return res.status(401).send("Not authorized to access this router");
    }
  } catch (err) {
    console.log(3)
    return res.status(401).send("Not authorized to access this router");
  }
};
