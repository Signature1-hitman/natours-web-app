const mongoose=require('mongoose')
const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });
const app = require('./app');
const DB="mongodb+srv://p:p@cluster0.jukqv.mongodb.net/natours?retryWrites=true&w=majority"
mongoose.connect(DB,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false, useUnifiedTopology: true }).then(con=>{
  
  console.log('successfull')
})


const port = process.env.PORT || 3000;
const server =app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
//Test

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
