import { ApiError } from "../../helper/ApiError";
import httpStatus from "../../helper/httpStatusCode";
import { categoryRepository } from "./category.repository";
import { ICategory } from "./category.validation";

const getAll = async () => {
  return await categoryRepository.getAll()
}

const getBySlug = async (slug: string) => {
  return await categoryRepository.findBySlug(slug)
}

const create = async (payload: ICategory) => {
  const slug = payload.name.toLowerCase().trim().split(" ").join("_");
  return await categoryRepository.create({ ...payload, slug })
}

const update = async (id: string, payload: ICategory) => {

  const existingCategory = await categoryRepository.findByID(id)

  if (!existingCategory) throw new ApiError(httpStatus.NOT_FOUND, "Category not found!")

  const slug = payload.name.toLowerCase().trim().split(" ").join("_");
  
  return await categoryRepository.updateByID(id, { ...payload, slug })
}


export const categoryService = { getAll, create, update, getBySlug }