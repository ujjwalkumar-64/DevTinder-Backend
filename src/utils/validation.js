import validator from "validator";

const validateSignupData= (req)=>{
    const {firstName,lastName,email,password} = req.body
    if(!firstName || !lastName){
        throw new Error("name is not valid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("email is not valid")
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }
};


const validateEditProfileData = (req)=>{

    const allowedEditFields=[
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills"
    ]


    const isEditAllowed = Object.keys(req.body).every((field)=>{
        allowedEditFields.includes(field)
    })

    return isEditAllowed;
}


export  {
    validateSignupData,
    validateEditProfileData
}