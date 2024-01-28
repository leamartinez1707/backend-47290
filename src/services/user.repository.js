export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }
    getAll = async () => await this.dao.getAll()
    delete = async () => await this.dao.delete()
    deleteOne = async (email) => await this.dao.deleteOne(email)
    updateRol = async (email, rol) => await this.dao.updateRol(email, rol)
}