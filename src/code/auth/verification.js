import UserModel, { UserDB } from '@/database/models/user';
import { AsyncSafeResult } from '../types';
import { AppError } from '../errors';
import { OTPType } from '@/database/models/OTP';
import { createOTP, validateOTP } from './otp';

export async function createEmailVerificationOTP(
  id,
){
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw AppError.unauthorized();
      // throw new InvalidDataError('Invalid user id');
    }
    if (user.isVerified) {
      throw AppError.invalid('User email is verified');
      // throw new InvalidDataError('User email is verified');
    }
    const otp = await createOTP(user.email, OTPType.EMAIL_VERIFICATION);
    return { result: { otp, user }, error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function verifyUserEmail(userId, otp) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.unauthorized();
    }
    const isValidated = await validateOTP(otp, user.email, OTPType.EMAIL_VERIFICATION);
    if (!isValidated) {
      throw AppError.invalid('The provided OTP is not valid or has expired.');
    }
    user.isVerified = true;
    await user.save();
    return null;
  } catch (error) {
    return error;
  }
}

export async function createForgotPasswordOTP(
  email,
) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw AppError.invalid(
        'The provided email address is not valid or does not exist in our system.',
      );
    }
    const otp = await createOTP(user.email, OTPType.FORGOT_PASSWORD);
    return { result: { otp, user }, error: null };
  } catch (error) {
    return { error, result: null };
  }
}

export async function OTPVerification(
  email,
  otp,
  type,
) {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw AppError.invalid(
        'The provided email address is not valid or does not exist in our system.',
      );
    }
    const isValid = await validateOTP(otp, email, type);
    return { result: isValid, error: null };
  } catch (error) {
    return { error, result: null };
  }
}
