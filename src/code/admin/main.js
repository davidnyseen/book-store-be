import bcrypt from 'bcrypt';
import AdminModel from '@/database/models/admin';
import { createToken } from '../auth/token';
import Config from '@/config';
import ManagerService from './manager';
import { AdminService, SuperAdminService } from './admin';
import { AppError } from '../errors';

export * from './interfaces';

export async function adminLogin(credentials) {
  try {
    const { email, password } = credentials;
    const admin = await AdminModel.findOne({ email }).select('+password').exec();
    if (!admin) {
      throw AppError.invalidCredentials();
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw AppError.invalidCredentials();
    }

    const token = createToken({ id: admin.id }, Config.ACCESS_TOKEN_PRIVATE_KEY, '30d');
    return { result: { token }, error: null };
  } catch (err) {
    return { error: err, result: null };
  }
}

export async function getAdminServiceByIdAndRole(adminId, adminRole) {
  try {
    const adminRecord = await AdminModel.findById(adminId);
    if (!adminRecord) {
      throw AppError.unauthorized();
    }

    switch (adminRole) {
      case 'admin':
        return { result: new AdminService(adminRecord._id.toString(), adminRecord.role), error: null };
      case 'superadmin':
      case 'manager':
        if (['superadmin', 'manager'].includes(adminRecord.role)) {
          return { result: new SuperAdminService(adminRecord._id.toString(), adminRecord.role), error: null };
        }
        break;
      case 'manager':
        if (adminRecord.role === 'manager') {
          return { result: new ManagerService(adminRecord.id.toString(), adminRecord.role), error: null };
        }
        break;
      default:
        throw AppError.unauthorized();
    }
  } catch (err) {
    return { error: err, result: null };
  }
}
