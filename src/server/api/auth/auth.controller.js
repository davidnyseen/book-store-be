const { Request, Response } = require('express');
const { Controller } = require('@server/decorator/controller');
const { Validate } = require('@server/decorator/validate');
const {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} = require('./auth.valid');
const { HttpStatus } = require('@server/utils/status');
const {
  JWTAuthService,
  OAuthAuthService,
  OTPVerification,
  createEmailVerificationOTP,
  createForgotPasswordOTP,
  resetPassword,
  verifyUserEmail,
} = require('@/core/auth');
const RequestError = require('@server/utils/errors').RequestError;
const { handleResultError, unwrapResult } = require('@server/utils/errors');
const { User } = require('@/core/user');
const emails = require('@/core/emails');
const { OTPType } = require('@/database/models/OTP');

class AuthController {
  @Validate(loginSchema)
  async login(req, res) {
    const body = req.body;
    const result = await JWTAuthService.login(body);
    const response = unwrapResult(result);
    res.json(response, HttpStatus.Ok);
  }

  @Validate(registerSchema)
  async register(req, res) {
    const body = req.body;
    const result = await JWTAuthService.register({
      email: body.email,
      fullName: body.fullName,
      password: body.password,
      phone: body.phone,
    });
    const response = unwrapResult(result);
    res.json(response, HttpStatus.Created);
  }

  async refresh(req, res) {
    const refreshToken = req.get('X-Refresh-Token');
    if (!refreshToken) {
      throw new RequestError('not authorized', HttpStatus.Unauthorized);
    }
    const result = await JWTAuthService.refreshToken(refreshToken);
    const newAccessToken = unwrapResult(result);
    res.json({ accessToken: newAccessToken }, HttpStatus.Created);
  }

  google(req, res) {
    const url = OAuthAuthService.loginGooglePageUrl();
    res.redirect(url);
  }

  async googleRedirect(req, res) {
    if (!req.query.code) {
      throw new RequestError('Only access from google Oauth2', HttpStatus.BadRequest);
    }
    const response = await OAuthAuthService.handleGoogleCode(req.query.code.toString());
    const result = unwrapResult(response);
    res.json(result, HttpStatus.Created);
  }

  @Validate(changePasswordSchema)
  async changePassword(req, res) {
    const body = req.body;
    const user = new User(req.userId);
    const error = await user.changePassword({
      newPassword: body.password,
      oldPassword: body.oldPassword,
    });
    if (error) {
      handleResultError(error);
    }
    res.json({}, HttpStatus.Ok);
  }

  async sendVerifyEmail(req, res) {
    const otp = await createEmailVerificationOTP(req.userId);
    const result = unwrapResult(otp);
    await emails.sendOTPEmail(result.otp, result.user);
    res.json({}, HttpStatus.Ok);
  }

  async verifyEmail(req, res) {
    const otp = req.params['otp'].toString();
    if (!otp || otp.length !== 6) {
      throw new RequestError('The provided OTP is not valid or has expired.', HttpStatus.BadRequest);
    }
    const error = await verifyUserEmail(req.userId, otp);
    if (error) {
      handleResultError(error);
    }
    res.json({}, HttpStatus.Ok);
  }

  @Validate(emailSchema)
  async forgotPassword(req, res) {
    const otp = await createForgotPasswordOTP(req.body['email']);
    const result = unwrapResult(otp);
    await emails.sendOTPPassword(result.otp, result.user);
    res.json({}, HttpStatus.Ok);
  }

  @Validate(resetPasswordSchema)
  async resetPassword(req, res) {
    const body = req.body;
    const error = await resetPassword(body);
    if (error) {
      handleResultError(error);
    }
    res.json({}, HttpStatus.Ok);
  }

  @Validate(verifyOTPSchema)
  async verifyPasswordOTP(req, res) {
    const body = req.body;
    const isVerified = await OTPVerification(body.email, body.otp, OTPType.FORGOT_PASSWORD);
    const result = unwrapResult(isVerified);
    res.json({ ok: result }, HttpStatus.Ok);
  }
}

module.exports = new AuthController();
