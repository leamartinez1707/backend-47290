import { UserService } from "../services/index.js"

const getUsers = async (req, res) => {
    const result = await UserService.getAll()
    res.status(result.statusCode).json({ status: 'success', payload: result })

}
const deleteUsers = async (req, res) => {

    const result = await UserService.delete()
    res.status(result.statusCode).json({ status: 'success', payload: result })
}
const deleteOneUser = async (req, res) => {
    const email = req.params.email
    const result = await UserService.deleteOne(email)
    res.status(result.statusCode).json({ status: 'success', payload: result })
}
const updateRol = async (req, res) => {
    const email = req.params.email
    const rol = req.params.rol
    const result = await UserService.updateRol(email, rol)
    res.status(result.statusCode).json({ status: 'success', payload: result })

}
export default { getUsers, deleteUsers, deleteOneUser, updateRol }