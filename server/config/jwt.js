const jwt = require("jsonwebtoken");
exports.signToken = function signToken(id, res) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // <-- Dynamic sameSite
        secure: process.env.NODE_ENV === "production",
        path: '/', // Explicitly set path

    };

    res.cookie("jwt", token, cookieOptions);
    return token;
}
exports.signTokenForTest = function signToken(candidateId, companyId, jobDescriptionId) { //id is candidate id
    const token = jwt.sign({ id: candidateId, companyId: companyId, jobDescriptionId: jobDescriptionId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_FOR_TEST,
    });

    return token;
}