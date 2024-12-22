import userDTO from '../DAO/DTO/users.dto.js'
import CustomError from '../errors/customError.js';
import EErros from '../errors/enumErrors.js';
import { generateUserErrorInfo } from '../errors/info.js';
import __dirname from '../utils.js';

export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    get = async () => {
        try {
            return await this.dao.get();
        } catch (error) {
            throw new Error('An error ocurred getting users')
        }
    }

    create = async (data) => {
        try {
            const dataToInsert = new userDTO(data)
            return await this.dao.create(dataToInsert)
        } catch (error) {
            CustomError.createError({
                name: "User create error",
                cause: generateUserErrorInfo(),
                message: "Error trying to create new user",
                code: EErros.INVALID_TYPES_ERROR
            })
        }
    }

    getUsersByCond = async (cond) => {
        try {
            const users = await this.dao.getUsersByCond(cond)
            return users
        } catch (error) {
            console.log('REPOSITORY: ',error);
            throw new Error('User not found')
        }
    }

    getOneByID = async (id) => {
        try {
            return await this.dao.getOneByID(id)
        } catch (error) {
            throw new Error('User not found')
        }
    }

    getOneByEmail = async (email) => {
        try {
            return await this.dao.getOneByEmail(email)
        } catch (error) {
            throw new Error('User not found')
        }
    }

    update = async (id, user) => {
        try {
            const result = await this.dao.update(id, user);
            return result;
        } catch (error) {
            throw new Error('An error ocurred updating user')
        }
    }

    deleteOne = async (id) => {
        try {
            return await this.dao.deleteOne(id)
        } catch (error) {
            throw new Error('An error ocurred deleting users')
        }
    }

    deleteMany = async (cond) => {
        try {
            return await this.dao.deleteMany(cond)
        } catch (error) {
            throw new Error('An error ocurred deleting users')
        }
    }

    saveDocuments = async (user, files) => {
        try {
            const newDocuments = files.map(file => ({
                name: file.document_type,
                reference: `${file.destination.replace(`${__dirname}/public`, '')}/${file.filename}`,
            }))
            const Documents = user.documents.concat(newDocuments)
            await this.update(user._id, { documents: Documents })
            return newDocuments
        } catch (error) {
            throw new Error('An error ocurred uploading files')
        }
    }
}
