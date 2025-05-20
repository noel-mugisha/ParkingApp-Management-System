import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export class UtilsService {
    static generateOtp(length: number): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return otp;
    }

    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, process.env.ACCESS_SECRET_KEY as string, {
            expiresIn: '1d',
        });
    }

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, process.env.REFRESH_SECRET_KEY as string, {
            expiresIn: '7d',
        });
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            return jwt.verify(token, process.env.ACCESS_SECRET_KEY as string) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        try {
            return jwt.verify(token, process.env.REFRESH_SECRET_KEY as string) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}