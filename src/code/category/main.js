import CategoryModel from "@/database/models/category"
import { AppError, ErrorType } from "../errors"
import { removeFile } from "../utils"
import { join } from "path"
import Config from "@/config"
import ProductModel from "@/database/models/product"
import { Gender } from "../gender"

export async function createCategory(data, adminId) {
  try {
    const category = await CategoryModel.create({
      addedBy: adminId,
      description: data.description,
      name: data.name,
      imageURL: data.image,
      gender: data.gender
    })
    return { result: _formatCategory(category), error: null }
  } catch (err) {
    if (err.code === 11000) {
      return {
        error: new AppError(
          ErrorType.Duplicate,
          "Category with name " + data.name
        ),
        result: null
      }
    }
    return { error: err, result: null }
  }
}

export async function getCategoryForUser(id) {
  try {
    const category = await CategoryModel.findById(id)
    if (!category) {
      throw AppError.notFound("Category with id" + id)
    }
    return { result: _formatCategory(category), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getAllCategories(gender) {
  try {
    let filter = {}
    if (gender === Gender.MALE) {
      filter.gender = { $in: [Gender.MALE, Gender.BOTH] }
    } else if (gender === Gender.FEMALE) {
      filter.gender = { $in: [Gender.FEMALE, Gender.BOTH] }
    }
    const categories = await CategoryModel.find(filter)
    const result = categories.map(category => _formatCategory(category))
    return { result: result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function updateCategory(id, cData) {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: cData },
      { new: true }
    )
    if (!category) {
      throw AppError.notFound("Category with id" + id)
    }
    return { result: _formatCategory(category), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function AddProductToCategory(catId, prodIds) {
  try {
    const cat = await CategoryModel.findById(catId)
    if (!cat)
      return {
        error: AppError.notFound("Category with " + catId),
        result: null
      }
    await ProductModel.updateMany(
      { _id: { $in: prodIds } },
      { $addToSet: { categories: cat._id } }
    )
    return { result: _formatCategory(cat), error: null }
  } catch (error) {
    return { error, result: null }
  }
}

export async function removeProductFromCategory(catId, prodIds) {
  try {
    await ProductModel.updateMany(
      { _id: { $in: prodIds } },
      { $pull: { categories: catId } }
    )
    return null
  } catch (error) {
    return error
  }
}

export async function removeCategory(id) {
  try {
    const category = await CategoryModel.findById(id)
    if (!category) return AppError.notFound("Category with " + id)
    await removeFile(join(Config.CatImagesDir, category.imageURL))
    await CategoryModel.findByIdAndRemove(id)
    return null
  } catch (err) {
    return err
  }
}

function _formatCategory(cDoc) {
  return {
    id: cDoc.id.toString(),
    name: cDoc.name,
    description: cDoc.description || "",
    imageURL: cDoc.imageURL,
    gender: cDoc.gender
  }
}
