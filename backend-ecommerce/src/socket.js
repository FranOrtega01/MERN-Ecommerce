import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import chatRouter from './routes/chat.router.js'
import productViewRouter from './routes/products.view.router.js'
import cartViewRouter from './routes/cart.view.router.js'
import sessionRouter from './routes/session.router.js'
import userRouter from './routes/user.router.js'
import mockingRouter from './routes/mocking.router.js'
import loggerTest from "./routes/logger.router.js"
import { passportCall } from "./utils.js";

const socket = (io, app) => {
    
    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    // Config de rutas
    app.get('/', (req, res) => {
        req.user ? res.redirect('/products') : res.redirect('/session/login')
    })

    app.use('/products', passportCall('jwt') , productViewRouter)
    app.use('/cart', passportCall('jwt'), cartViewRouter )
    app.use('/api/products', productRouter)
    app.use('/api/carts',passportCall('jwt'), cartRouter)
    app.use('/api/users', passportCall('jwt'), userRouter)
    app.use('/chat', passportCall('jwt'), chatRouter)
    app.use('/session', sessionRouter) 
    app.use('/mockingproducts', mockingRouter)
    app.use("/loggerTest", loggerTest)
    app.use("*", (req, res) => {
        res.render('errors/404')
    })
}


export default socket