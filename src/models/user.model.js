const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email is required"],
        trim : true,
        lowercase : true,
        unique : [true, "Email already exists"],
        match : [/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },
    name : {
        type : String,
        required : [true, "Name is required to create an account"],
        trim : true
    },
    password : {
        type : String,
        required : [true, "Password is required to create an account"],
        minlength : [8, "Password must be at least 8 characters long"],
        select : false
    },
    },
    {
    timestamps : true
})

userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();

});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel
