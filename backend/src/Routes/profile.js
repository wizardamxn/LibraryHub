const express = require('express')
const authorised = require('../middlewares/authorised')
const profileRouter = express.Router()



profileRouter.get('/profile', authorised, async (req,res) =>{
    try{
        const {user} = req
        res.status(200).send(user)
    }   
    catch(err){
        res.status(500).send("Error while getting the profile.")
    } 
})

module.exports = profileRouter