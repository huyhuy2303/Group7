const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://s3916278:s3916278@cluster0.8wxtrq2.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['shipper', 'vendor', 'customer'], // Define the possible roles
    },
})

const LogInCollection=new mongoose.model('LogInCollection',logInSchema)

module.exports=LogInCollection