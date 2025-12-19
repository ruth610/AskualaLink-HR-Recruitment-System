import sqlService from '../services/sqlService';
import statusCode from 'http-status-codes';


async function install(req, res){
    try {
        const result = await sqlService.install();
        return res.status(statusCode.CREATED).json({message: 'Installation successful', data: result});
    } catch (error) {
        console.log(error);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({message: 'Installation failed', error: error.message});
    }


}

module.exports = {
    install
};
