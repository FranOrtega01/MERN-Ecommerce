import { Router } from 'express';
import { authorization } from '../utils.js';
import {rolSwitch,rolUpgradeByDocuments , deleteLastConnecition, uploadDocuments} from '../controller/users.controller.js'
import { fileUploader } from '../config/multer.js';

const router = Router()

router.get('/premium/:uid', (req, res) => {
    const user = req.user
    console.log(user);
    res.render('sessions/PremiumFilesUpload', user)
})

router.post('/premium/:uid', authorization(['user']), rolUpgradeByDocuments)

router.post('/premium/:uid/unsubscribe', authorization(['premium']), rolSwitch)

router.delete('/delete', authorization(['admin']), deleteLastConnecition)

router.post('/:uid/documents', fileUploader.any(), uploadDocuments);


export default router