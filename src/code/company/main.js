import BrandModel from "@/database/models/company"
import { AppError, ErrorType } from "../errors"
import ProductModel from "@/database/models/product"

export async function createBrand(data) {
  try {
    const company = await BrandModel.create({
      name: data.name,
      description: data.description,
      link: data.link,
      logo: data.logo
    })
    return { result: _formatBrand(company), error: null }
  } catch (err) {
    if (err.code === 11000) {
      return {
        error: new AppError(
          ErrorType.Duplicate,
          "company already exists. [" + data.name + "]"
        ),
        result: null
      }
    }
    return { error: err, result: null }
  }
}

export async function getAllBrands() {
  try {
    const brands = await BrandModel.find()
    const result = brands.map(company => _formatBrand(company))
    return { result: result, error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function updateBrand(id, data) {
  try {
    const company = await BrandModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    )
    if (!company) {
      throw AppError.notFound("company not found.")
    }
    return { result: _formatBrand(company), error: null }
  } catch (err) {
    return { error: err, result: null }
  }
}

export async function removeBrand(id) {
  try {
    const company = await BrandModel.findById(id)
    if (!company) {
      throw AppError.notFound("company not found.")
    }
    await BrandModel.findByIdAndRemove(id)
    return null
  } catch (err) {
    return err
  }
}

export async function addProductsToBrand(brandId, prodIds) {
  try {
    const company = await BrandModel.findById(brandId)
    if (!company) {
      throw AppError.notFound("company not found.")
    }
    await ProductModel.updateMany(
      { _id: { $in: prodIds } },
      { $set: { company: company._id, brandName: company.name } }
    )
    return { result: _formatBrand(company), error: null }
  } catch (error) {
    return { error, result: null }
  }
}

export async function removeProductsFromBrand(brandId, prodIds) {
  try {
    await ProductModel.updateMany(
      { $and: [{ _id: { $in: prodIds } }, { company: brandId }] },
      { $unset: { company: "", brandName: "" } }
    )
    return null
  } catch (error) {
    return error
  }
}

function _formatBrand(doc) {
  return {
    id: doc.id.toString(),
    name: doc.name,
    description: doc.description || "",
    logo: doc.logo || "",
    link: doc.link
  }
}
