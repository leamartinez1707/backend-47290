import UserModel from './models/user.model.js';
import logger from '../utils/logger.js';
import nodemailer from 'nodemailer'
import config from '../config/config.js';
import UserInfoDto from '../dto/usersInfoDto.js';

export default class UserDao {

    constructor() {
        this.model = UserModel
    }

    getAll = async () => {


        try {
            let users = await this.model.find().lean()
            let newUsers = []

            if (!users) {
                return {
                    statusCode: 404, response: {
                        status: 'error', error: 'Users were not found'
                    }
                }

            } else {
                for (let index = 0; index < users.length; index++) {
                    const element = new UserInfoDto(users[index])
                    newUsers.push(element)
                }
                return {
                    statusCode: 200,
                    response: { status: 'success', payload: newUsers }
                }
            }
        } catch (error) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', error: 'Could not get users'
                }
            }
        }
    }

    delete = async () => {
        try {
            const users = await this.model.find().lean()
            let deleteUsers = []
            const mailConfig = {
                service: 'gmail',
                auth: { user: config.nodemailer_user, pass: config.nodemailer_pass }
            }
            const transporter = nodemailer.createTransport(mailConfig)

            if (!users) {
                return {
                    statusCode: 404, response: {
                        status: 'error', error: 'Users were not found'
                    }
                }
            }
            for (let i = 0; i < users.length; i++) {
                const element = users[i];
                const lastLogin = element.last_login;
                const now = new Date();

                // Calcula la diferencia en milisegundos
                const tiempoTranscurrido = now - lastLogin;
                // Convierte la diferencia a minutos
                const minutosTranscurridos = tiempoTranscurrido / (1000 * 60);
                // Verifica si la diferencia es mayor a 2 dias (2.880 minutos)
                if (minutosTranscurridos >= 2.880) {

                    await this.model.deleteOne(element._id)
                    deleteUsers.push(element.email)
                    logger.info(`El usuario ${element.email} ha sido eliminado por estar inactivo más de 2 días`)
                    let message = {
                        from: config.nodemailer_user,
                        to: element.email,
                        subject: '[ elem Shop ] Mensje de aviso!!',
                        html: `<h1>[ IMPORTANTE! ] eleM | Tienda de ropa online</h1>
                        <hr />
                        <h2> Nos contactamos con usted para informarle que la cuenta ha sido de baja por inactividad! </h2>
                        <h3> Si usted desea volver a ingresar a la web, por favor vuelva a registrarse!</h3>
                        <p> Tenga presente que si la cuenta se encuentra inactiva por más de 2 días, se eliminará del sistema.
                        <br>
                        <hr />
                        <br>
                        <br>
                        Saludos,<br><strong>Equipo de eleM Uruguay.</strong>`
                    }
                    await transporter.sendMail(message)
                }
            }
            return {
                statusCode: 200,
                response: { status: 'success', payload: `${deleteUsers.length > 0 ? `Los usuarios eliminados por inactividad fueron  ${deleteUsers}` : 'No se eliminó ningún usuario!'}` }
            }
        }
        catch (error) {
            return {
                statusCode: 500,
                response: {
                    status: 'error', error: error.message
                }
            }
        }
    }
}