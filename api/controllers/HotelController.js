import Hotel from "../models/Hotel.js"
import { createError } from "../utils/error.js";

export const createHotel = async(req, res, next) => {
    const newHotel = new Hotel(req.body)
    
    try { 
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    } catch(err){
        next(err)
    }
}

export const updateHotel = async(req, res, next) => {
    try { 
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body },
            { new: true },
        )
        if(updatedHotel === null || updatedHotel === undefined) return next(createError(404, "Hotel not found."))
        else res.status(200).json(updatedHotel)
    } catch(err){
        next(err)
    }
}

export const deleteHotel = async(req, res, next) => {
    try { 
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id)
        if(deletedHotel === null || deletedHotel === undefined) return next(createError(404, "Hotel not found."))
        else res.status(200).json("Hotel successfully deleted.")
    } catch(err){
        next(err)
    }
}

export const getHotel = async(req, res, next) => {
   try { 
        const hotel = await Hotel.findById(req.params.id)
        if(hotel === null || hotel === undefined) return next(createError(404, "Hotel not found."))
        else res.status(200).json(hotel)
    } catch(err){
        next(err)
    }
}

export const getHotels = async(req, res, next) => {
   try { 
        const hotels = await Hotel.find()
        res.status(200).json(hotels)
    } catch(err){
        next(err)
    }
}

export const countByCity = async(req, res, next) => {
    const cities = req.query.cities.split(",")
    try { 
         const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city })
         }))
         res.status(200).json(list)
     } catch(err){
         next(err)
     }
}

export const countByType = async(req, res, next) => {
    const hotelCount = await Hotel.countDocuments({type: "hotel" })
    const apartmentCount = await Hotel.countDocuments({type: "apartment" })
    const resortCount = await Hotel.countDocuments({type: "resort" })
    const villaCount = await Hotel.countDocuments({type: "villa" })
    const cabinCount = await Hotel.countDocuments({type: "cabin" })
    try { 
         res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartment", count: apartmentCount },
            { type: "resort", count: resortCount },
            { type: "villa", count: villaCount },
            { type: "cabin", count: cabinCount },
         ])
     } catch(err){
         next(err)
     }
 }