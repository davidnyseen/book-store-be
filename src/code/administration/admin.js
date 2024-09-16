import bcrypt from 'bcrypt';
import ProductModel from '../product';
import AdminModel from '@/database/models/admin';
import UserModel from '@/database/models/user';
import CategoryModel from '../category';
import {
  addProductsToBrand,
  createBrand,
  removeBrand,
  updateBrand,
  removeProductsFromBrand,
} from '../company';
import { addDiscount, removeDiscount } from '../product';
import { acceptChat, changeStatus, getChatById, getChats } from '../chat';
import collectionService from '../collection';
import { OrderServices, OrderStatus } from '../order';
import NotificationService, { AllUsers, NotificationMessage, NotificationType } from '../notification';
import { AppError } from '../errors';

export class AdminService {
  constructor(id, role) {
    this.adminId = id;
    this.adminRole = role;
  }

  async addNewProduct(productData) {
    return await ProductModel.createProduct(productData, this.adminId);
  }

  async updateProduct(productId, productData) {
    return await ProductModel.updateProduct(productId, productData);
  }

  async getAllUsers() {
    try {
      const users = await UserModel.find({});
      return { result: users, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async getUserById(userId) {
    try {
      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        throw AppError.notFound('User not found.');
      }
      return { result: user, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }

  async removeProductById(productId) {
    return ProductModel.removeProduct(productId);
  }

  async addNewCategory(categoryData) {
    return CategoryModel.createCategory(categoryData, this.adminId);
  }

  async addProductsToCategory(categoryId, productIds) {
    return CategoryModel.addProductsToCategory(categoryId, productIds);
  }

  async removeProductsFromCategory(categoryId, productIds) {
    return CategoryModel.removeProductsFromCategory(categoryId, productIds);
  }

  async updateCategory(categoryId, categoryData) {
    return CategoryModel.updateCategory(categoryId, categoryData);
  }

  async removeCategoryById(categoryId) {
    return CategoryModel.removeCategory(categoryId);
  }

  async banUserById(userId) {
    try {
      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        throw AppError.notFound('User not found.');
      }
      if (user.banned) {
        throw AppError.invalid('User is already banned');
      }
      user.banned = true;
      await user.save();
      return null;
    } catch (err) {
      return err;
    }
  }

  async unbanUserById(userId) {
    try {
      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        throw AppError.notFound('User not found.');
      }
      if (!user.banned) {
        throw AppError.invalid('User is already unbanned');
      }
      user.banned = false;
      await user.save();
      return null;
    } catch (err) {
      return err;
    }
  }

  async addNewBrand(brandData) {
    return createBrand(brandData);
  }

  async updateBrandById(brandId, brandData) {
    return updateBrand(brandId, brandData);
  }

  async removeBrandById(brandId) {
    return removeBrand(brandId);
  }

  async addProductsToBrandById(brandId, productIds) {
    return addProductsToBrand(brandId, productIds);
  }

  async removeProductsFromBrandById(brandId, productIds) {
    return removeProductsFromBrand(brandId, productIds);
  }

  async applyDiscountToProduct(productId, discount) {
    return addDiscount(productId, discount);
  }

  async removeDiscountFromProduct(productId) {
    return removeDiscount(productId);
  }

  async approveChat(chatId) {
    return acceptChat(this.adminId, chatId);
  }

  async fetchActiveChats() {
    return getChats();
  }

  async fetchChatById(chatId) {
    return getChatById(chatId);
  }

  async closeChatById(chatId) {
    return changeStatus(chatId, 'closed');
  }

  async createNewCollection(collectionData) {
    return collectionService.create(collectionData);
  }

  async updateCollectionById(collectionId, collectionData) {
    return collectionService.edit(collectionId, collectionData);
  }

  async deleteCollectionById(collectionId) {
    return collectionService.remove(collectionId);
  }

  async modifyOrderStatus(orderId, status) {
    const orderService = new OrderServices();
    return orderService.changeOrderStatus(orderId, status);
  }

  async sendNotification(notificationMessage) {
    const notification = new NotificationService(NotificationType.GENERAL, AllUsers);
    return await notification.push(notificationMessage);
  }
}

export class SuperAdminService extends AdminService {
  constructor(id, role) {
    super(id, role);
  }

  async createNewAdmin(adminData) {
    try {
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      const newAdmin = await AdminModel.create({
        email: adminData.email,
        password: hashedPassword,
        address: adminData.address,
        name: adminData.name,
        role: 'admin',
        phone: adminData.phone,
        addedBy: this.adminId,
      });
      return {
        error: null,
        result: {
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt,
        },
      };
    } catch (err) {
      if (err.code === 11000) {
        err = AppError.invalid('Cannot create Admin');
      }
      return { error: err, result: null };
    }
  }

  async deleteAdminById(adminId) {
    try {
      const admin = await AdminModel.findById(adminId);
      if (!admin) throw AppError.notFound('Admin not found.');

      if (this.adminId === admin._id.toString()) {
        throw AppError.permission();
      }

      if (this.adminRole === 'superadmin' && ['superadmin', 'manager'].includes(admin.role)) {
        throw AppError.permission();
      }

      await AdminModel.deleteOne({ _id: adminId });
      return null;
    } catch (err) {
      return err;
    }
  }

  async listAllAdmins(role) {
    try {
      const query = {};
      if (role === 'admin') query.role = 'admin';
      if (role === 'super') query.role = 'superadmin';

      const admins = await AdminModel.find({ $and: [query, { role: { $ne: 'manager' } }] });
      const result = admins.map(admin => ({
        id: admin._id.toString(),
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
      }));
      return { result, error: null };
    } catch (err) {
      return { error: err, result: null };
    }
  }
}
