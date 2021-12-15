const jwt = require('jsonwebtoken')

exports.refreshTokens = async (req, res) => {
    const accessToken = getSignedToken(
        'access', 
        req.uid,
        req.uemail, 
        Buffer.from(process.env.ACCESS_PRIVATE , 'base64').toString('ascii'),
        process.env.ACCESS_EXPIRE
    );
    const refreshToken = getSignedToken(
        'refresh', 
        req.uid,
        req.uemail, 
        Buffer.from(process.env.REFRESH_PRIVATE , 'base64').toString('ascii'),
        process.env.REFRESH_EXPIRE
    );
    res.status(200).json({
        success: true, 
        accessToken, 
        refreshToken
    });
}

const getSignedToken = (type, id, email, key, expires) => {
	return jwt.sign(
	{ 
		type,
		id,
        email,
		authLevel2: true 
	}, 
	key,
	{ 
		expiresIn: expires,
		algorithm: 'RS256'
	});
}
