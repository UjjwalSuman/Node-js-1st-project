const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign(id, '12234444', { expiresIn: 86400 });
}

module.exports.signUp = async (req,res) => {
  const {name, email, password} = req.body;
  const user = await User.findOne({email: email});
  if (user) {
    return res.status(400).json({
      status: false,
      message: 'User already exists'
    })
  }

  const encryptPassword = await bcrypt.hashSync(password, 10);
  const newUser = await User.create({name,email,password: encryptPassword});
  return res.status(201).json({
    status: true,
    data: newUser,
  });
}

module.exports.signIn = async (req,res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "email/password is incorrect"
    })
  }
  if (await !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({
      status: false,
      message: "password/email is incorrect"
    })
  }

  const token = createToken(user.toJSON());

  return res.status(200).json({
    status: true,
    data: user,
    token
  });
}


module.exports.getAllUser = async(req, res) => {
  const user = await User.find();
  return res.status(200).json({
    status: true,
    data: user,
  })
}

module.exports.getUserByEmail = async(req, res) => {
  const user = await User.findOne({
    email:req.params.email
  });
  if(user){
    return res.status(200).json({
      status: true,
      data: user,
    })
  }
  else{
    return res.status(404).json({
      status: false,
      message:'USer is not available'
    })
  }
  
};

module.exports.deleteUser = async(req, res) => {
  const user = await User.findByIdAndDelete(
    req.userId
  );
  if(user){
    return res.status(200).json({
      status: true,
      message: 'User deleted successfully'
    })
  }
  else{
    return res.status(404).json({
      status: false,
      message:'USer is not available'
    })
  }
  
};


module.exports.passwordChange = async(req, res) => {
  const user = await User.findOne({_id:req.userId})
  if(!user) {
    return res.status(404).json({
      status: false,
      message:'User is not available'
    })
  }
  if(await !bcrypt.compareSync(req.body.currentPassword,user.password)){
    return res.status(400).json({
      status: false,
      message:'Current Password is incorrect'
    })
  }
  const encryptPassword = await bcrypt.hashSync(req.body.newPassword, 10);
  user.password=encryptPassword
  await user.save();
  return res.status(200).json({
    status: true,
    message: 'Password Successfully Changed'
  })
  
};


module.exports.changeEmail = async(req, res) => {
  const user = await User.findOne({_id:req.params.id})
  if(!user) {
    return res.status(404).json({
      status: false,
      message:'User is not available'
    })
  }
  user.email=req.body.email
  await user.save();
  return res.status(200).json({
    status: true,
    message: 'Email Successfully Changed'
  })
  
};

module.exports.verifyAuthentication = (req,res,next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
   return res.status(404).json({
      status: false,
      message: 'Please provide valid token'
   });
  }

  jwt.verify(token, '12234444', (err, decoded) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err.message
      })
    } else {
      req.userId = decoded._id;
      next();
    }
  });
}