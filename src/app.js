const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require ("express-handlebars");
const socket = require("socket.io");





//Passport: 
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

//Creación de Servidor:

const app = express();
const PUERTO = 8080;
require("./database.js");



const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");

// Variables de entorno
const configObject = require("./config/config.js")
const { mongo_url } = configObject

//Middleware
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: "CookieFirmadaCorrectamente",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://pruebaaa5back:lSI4my0JrQzCeyeu@cluster9.onzmhdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9",
        ttl: 11200
    })
    
   

}))
//PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session())




//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");




app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);




const httpServer = app.listen(PUERTO, ()=> {
    console.log(`Escuchando en el Puerto ${PUERTO}`);
})


//Chat de la casa de repuestos
const MessageModel = require("./dao/models/message.model.js");
const io = new socket.Server(httpServer);


io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        await MessageModel.create(data);
        
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
})