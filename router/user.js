const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/sign-up',userController.signUp);
router.post('/sign-in',userController.signIn);
router.get('/all',userController.getAllUser);


router.get('/getUserByEmail/:email',userController.verifyAuthentication,userController.getUserByEmail);
router.delete('/deleteUser',userController.verifyAuthentication,userController.deleteUser);
router.patch('/change-password',userController.verifyAuthentication,userController.passwordChange);
router.put('/:id',userController.verifyAuthentication,userController.changeEmail);





//exports the router
module.exports = router;
 