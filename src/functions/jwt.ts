import jwt from "jsonwebtoken";

export const signToken = (data: { id: any, operation: string }) => {
    // you can change the expires in time to as required
    return jwt.sign({ ...data }, `${process.env.jwt_secret}`, { expiresIn: '1h' });
}

function isTokenExpired(token: string) {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    const exp = decoded.exp;
    const expired = (Date.now() >= exp * 1000)
    return expired
}

export const verifyToken = (token: any) => {
    if (!(token)) throw new Error(`Invalid data passed`);
    if (isTokenExpired(token)) throw new Error(`This token has expired`)
    else return jwt.verify(token, `${process.env.jwt_secret}`);
}