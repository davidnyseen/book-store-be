import { join } from "node:path"
import BrandModel from "@/database/models/company"
import { AppError } from "../errors"
import CategoryModel from "@/database/models/category"
import ProductModel from "@/database/models/product"
import * as Helper from "./helper"
import { removeFile } from "../utils"
import Config from "@/config"

export async function createProduct(data, adminId) {
  try {
    const productModelData = {
      ...data,
      imagesURL: data.imagesUrl,
      addedBy: adminId
    }
    if (data.brandId) {
      const company = await BrandModel.findById(data.brandId)
      if (!company) throw AppError.invalid("Invalid company id " + data.brandId)
      productModelData.company = company._id.toString()
      productModelData.brandName = company.name
    }
    if (data.categoryId) {
      const category = await CategoryModel.findById(data.categoryId)
      if (!category)
        throw AppError.invalid("Invalid company id " + data.categoryId)
      productModelData.category = category._id
    }
    const product = await ProductModel.create(productModelData)
    const result = Helper._formatProduct(product)
    return { result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getProductForUser(id) {
  try {
    const product = await Helper._getProduct(id)
    const result = Helper._formatProduct(product)
    return { result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getProductForAdmin(id) {
  try {
    const product = (await Helper._getProduct(id)).toObject()
    const productResult = {
      ...product,
      id: product._id.toString()
    }
    return { result: productResult, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function getProductsList(options) {
  try {
    const page = options.page || 1
    const limit = options.limit || 20
    const skipDocsNumber = (page - 1) * limit
    const productsQuery = ProductModel.find(
      Helper._filterProduct(options.filter)
    )
    Helper._sortProduct(productsQuery, options.sort)
    const products = await productsQuery
      .skip(skipDocsNumber)
      .limit(limit)
      .exec()
    const count = await ProductModel.count(
      Helper._filterProduct(options.filter)
    )
    const result = {
      products: products.map(p => Helper._formatItemProductList(p)),
      count: products.length,
      page: page,
      totalItems: count,
      totalPages: Math.ceil(count / limit)
    }
    return { result, error: null }
  } catch (error) {
    return { result: null, error }
  }
}

export async function updateProduct(id, productData) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          imagesURL: productData.imagesUrl,
          ...productData
        }
      },
      { new: true }
    )
    if (!product) throw AppError.invalid("Product with" + id + " not found.")
    return { result: Helper._formatProduct(product), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function removeProduct(id) {
  try {
    const product = await Helper._getProduct(id)
    for (const image of product.imagesURL) {
      await removeFile(join(Config.ProductImagesDir, image))
    }
    await ProductModel.findByIdAndRemove(id)
    return null
  } catch (err) {
    return err
  }
}

export async function productsInfo() {
  try {
    const productsInfo = await ProductModel.aggregate([
      { $unwind: { path: "$sizes", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$colors", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
          sizes: { $addToSet: "$sizes" },
          colors: { $addToSet: { name: "$colors.name", hex: "$colors.hex" } }
        }
      },
      { $project: { _id: 0 } }
    ])
    const info = productsInfo[0]
    return { result: info, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}
