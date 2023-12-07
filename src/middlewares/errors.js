import logger from '../utils/logger.js';
import EErros from '../services/errors/enums.js';

export default (error, req, res, next) => {
    console.log(error)
    switch (error.code) {
        case EErros.INVALID_TYPES_ERROR:
            console.log('ERROR controlado')
            res.status(400).send({ status: 'error', error: error })
            break;
        case EErros.PRODUCT_CODE:
            console.log('ERROR controlado')
            res.status(400).send({ status: 'error', error: error })
        default:
            console.log('ERROR SIN CONTROLAR')
            res.status(500).send({ status: 'error', error: 'Unhandled error' })
            break;
    }
}