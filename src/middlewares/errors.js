import EErros from '../services/errors/enums.js';

export default (error, req, res, next) => {
    console.log('middleware ERROR')
    console.log(error)
    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            console.log('ERROR controlado')
            res.status(400).send({ status: 'error', error: error.case })
            break;
        case EErros.PRODUCT_CODE:
            console.log('ERROR controlado')
            res.status(400).send({ status: 'error', error: error.case })
        default:
            console.log('ERROR SIN CONTROLAR')
            res.status(error.status).send({ status: 'error', error: 'Unhandled error' })
            break;
    }
}