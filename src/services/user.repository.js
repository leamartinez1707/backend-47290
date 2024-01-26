export default class UserRepository {

    constructor(dao) {
        this.dao = dao
    }
    getAll = async () => await this.dao.getAll()
    delete = async () => await this.dao.delete()
}