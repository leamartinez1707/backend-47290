import bcrypt from 'bcrypt'
import { fakerES as faker } from '@faker-js/faker'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateUser = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 150 }),
        code: faker.commerce.productAdjective(),
        category: faker.commerce.department(),
        stock: faker.number.int({ max: 100 }),
        thumbnail: faker.image.avatar(({ height: 480, width: 640 }))
    }
}
