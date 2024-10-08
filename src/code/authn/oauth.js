import QueryString from 'qs';
import axios from 'axios';
import Config from '@/config';
import jwt from 'jsonwebtoken';
import UserModel from '@/database/models/user';
import { createToken } from './token';
import { AppError, ErrorType } from '../errors';

class OAuthAuthService {
  static loginGooglePageUrl() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/auth';
    const options = {
      redirect_uri: Config.GOOGLE_REDIRECT,
      client_id: Config.GOOGLE_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    };
    const searchParams = QueryString.stringify(options);
    return `${rootUrl}?${searchParams}`;
  }

  static async handleGoogleCode(code) {
    try {
      const url = 'https://oauth2.googleapis.com/token';
      const body = {
        code,
        client_id: Config.GOOGLE_ID,
        client_secret: Config.GOOGLE_SECRET,
        redirect_uri: Config.GOOGLE_REDIRECT,
        grant_type: 'authorization_code',
      };
      const response = await axios.post(url, body);
      const userData = jwt.decode(response.data.id_token);
      let user = await UserModel.findOne({ email: userData.email });
      if (!user) {
        user = await UserModel.create({
          email: userData.email,
          fullName: userData.name,
          provider: 'GOOGLE',
        });
      }
      const accessToken = createToken({ id: user._id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '600s');
      const refreshToken = createToken(
        { id: user._id },
        Config.REFRESH_TOKEN_PRIVATE_KEY,
        Config.REFRESH_TOKEN_EXP,
      );
      const result = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        accessToken,
        refreshToken,
      };
      return { result, error: null };
    } catch {
      return {
        result: null,
        error: new AppError(ErrorType.UnauthorizedGoogle, 'Failed to authenticate with Google.'),
      };
    }
  }
}

module.exports = OAuthAuthService;