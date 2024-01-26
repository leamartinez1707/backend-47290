import { UserService } from "../services/index.js"

const getUsers = async (req, res) => {
    const result = await UserService.getAll()

    res.status(result.statusCode).json({ status: 'success', payload: result })

}

const deleteUsers = async (req, res) => {

    const result = await UserService.delete()
    res.status(result.statusCode).json({ status: 'success', payload: result })
}

export default { getUsers, deleteUsers }