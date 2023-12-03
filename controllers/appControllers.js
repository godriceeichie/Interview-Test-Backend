import Sector from '../models/sectorModel.js'
import FormData from '../models/formDataModel.js'
import mongoose from 'mongoose'

// Controller function to get all sectors
export const getSectors = async (req, res) => {
    try{
        const sectors = await Sector.find({})
        return res.status(200).json({sectors})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}

export const getFormData = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({ error: 'No such form data' })
    }

    const formData = await FormData.findById(id)
    if (!formData) {
        return res.status(404).json({ err: 'No such formData' })
    }
    res.status(200).json(formData) 
}

// Controller function to handle form data submission
export const postFormData = async (req, res) => {
     // Extract data from the request body
    const { name, sector, hasAgreed } = req.body
    let emptyFields = []

    
    // Validate required fields
    if(!name){
        emptyFields.push('name')
    }

    if(!sector){
        emptyFields.push('sector')
    }

    if(!hasAgreed){
        emptyFields.push('hasAgreed')
    }

    // If any required fields are missing, respond with a 400 status code
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }
    try{
        const formData = await FormData.create({name, sector, hasAgreed})
        return res.status(200).json(formData)
    }catch(error){
        return res.status(400).json({ error: error.message })
    }
}

export const updateFormData = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such form data' })
    }

    const formData = await FormData.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!formData) {
        return res.status(400).json({ error: 'No such form data' })
    }

    res.status(200).json(formData)
}

