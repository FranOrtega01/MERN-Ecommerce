import { UserService } from '../repository/index.js'
import { transport } from '../utils.js';
import config from '../config/config.js';

const hasDocumentWithName = (user, name) => {
    if (!user.documents || user.documents.length === 0) {
        return false;
    }
    const result = user.documents.some((document) =>
        document.name.includes(name)
    );
    return result
}

const getUsersByCond = async (cond) => {
    try {
        const users = await UserService.getUsersByCond(cond)
        return users
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export const get = async (req, res) => {
    const user = await UserService.get()
    res.json({ user });
}

export const create = async (req, res) => {
    const data = req.body

    try {
        const newUser = await UserService.create(data)

        return res.json({ status: 'success', payload: newUser });
    } catch (error) {
        return res.json({ status: 'error', error });
    }

}

export const getOneByID = async (req, res) => {
    const { uid } = req.params

    try {
        const user = await UserService.getOneByID(uid)

        return res.json(user)
    } catch (error) {
        return res.json(error)
    }
}

export const getOneByEmail = async (req, res) => {
    const { email } = req.params
    try {
        const user = await UserService.getOneByEmail(email)

        return res.json(user)
    } catch (error) {
        return res.json(error)
    }
}

export const update = async (req, res) => {
    const { uid } = req.params
    const data = req.body
    try {
        const updatedUser = await UserService.update(uid, data)

        res.json({ status: 'success', updatedUser })
    } catch (error) {
        res.json({ status: 'error', error })
    }
}

export const deleteOne = async (req, res) => {
    const { uid } = req.params
    try {
        const deletedUser = await UserService.deleteOne(uid)

        res.json({ status: 'success', deletedUser })
    } catch (error) {
        res.json({ status: 'error', error })
    }
}


// Api Users

export const uploadDocuments = async (req, res) => {
    try {
        console.log(req?.files, req?.file);
        const user = await UserService.getOneByID(req.user.user._id)
        const documents = await UserService.saveDocuments(user, req.files)
        return res.status(200).send({ status: 'succes', message: 'Files uploaded' }).redirect('/session/profile')
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 'error', error: 'An error ocurred uploading your files' })
    }
}

export const rolSwitch = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await UserService.getOneByID(uid);
        if (!user) return res.status(404).send({ status: 'error', error: "User not found" })
        if (user.rol == "admin") res.status(400).send({ status: 'error', error: "User is admin" })
        user.rol = user.rol == "user" ? "premium" : "user";
        const newUser = await UserService.update(uid, user);
        console.log(newUser, user.rol);
        return res.status(200).redirect("/session/logout");
    } catch (error) {
        return console.log(error);
    }
}

export const rolUpgradeByDocuments = async (req, res) => {
    const { user } = req.user;
    try {
        if (
            hasDocumentWithName(user, 'Identificacion') &&
            hasDocumentWithName(user, 'ComprobanteDomicilio') &&
            hasDocumentWithName(user, 'ComprobanteEstadoCuenta')
        ) {
            user.rol = "premium";
            await UserService.update(user._id, user);
            res.status(200).redirect("/session/logout");
        }
        else {
            return res.status(400).send({ status: 'error', error: "Falto subir uno de estos archivos: Identificacion,ComprobantoDomicilio,ComprobanteEstadoCuenta" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 'error', error: "Hubo un error" })
    }
}

export const deleteLastConnecition = async (req, res) => {
    try {
        // Timestamp 2 days ago | 2 days = 172800000
        const twoDaysAgo = Date.now() - 60 * 1000 * 2;
        const conditions = {
            last_connection: { $lt: twoDaysAgo },
            rol: { $ne: 'admin' }
        };

        const users = await getUsersByCond(conditions)

        users.forEach(async user => {
            await transport.sendMail({
                from: config.gmailAppEmail,
                to: user.email,
                subject: 'Deleted user',
                html: `
                    <p>Hola, ${user.first_name}! Te informamos que tu cuenta fue eliminada.</p>
                `
            })
        })


        const deletedUsers = await UserService.deleteMany(conditions)
        res.json({ status: 'success', deletedUsers })
    } catch (error) {
        console.log('CONTROLLER: ', error);
        res.json({ status: 'error', error })
    }
}