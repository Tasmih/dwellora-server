import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";

import { serviceCollection } from "../models/service.models.js";


// create service 
export const createService: RequestHandler = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      image,
    } = req.body;


    if (
      typeof title !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof image !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });

      return;
    }


    const service = {
      title,
      slug,
      description,
      image,
      status: "published" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    const result = await serviceCollection().insertOne(service);


    res.status(201).json({
      success: true,
      message: "Service created successfully",
      id: result.insertedId,
    });


  } catch (error) {
    next(error);
  }
};


// get all service 

export const getServices: RequestHandler = async (_req, res, next) => {
  try {

    const services = await serviceCollection()
      .find()
      .sort({
        createdAt: -1,
      })
      .toArray();


    res.status(200).json({
      success: true,
      services,
    });


  } catch (error) {
    next(error);
  }
};

// get single service 
export const getServiceById: RequestHandler = async (
  req,
  res,
  next
) => {

  try {

    const id = req.params.id;


    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid service id",
      });

      return;
    }



    const service = await serviceCollection().findOne({
      _id: new ObjectId(id),
    });



    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });

      return;
    }



    res.status(200).json({
      success: true,
      service,
    });



  } catch (error) {
    next(error);
  }
};

//update service

export const updateService: RequestHandler = async (
  req,
  res,
  next
) => {

  try {

    const id = req.params.id;


    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success:false,
        message:"Invalid service id",
      });

      return;
    }



    const {
      title,
      slug,
      description,
      image,
    } = req.body;



    await serviceCollection().updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set:{
          title,
          slug,
          description,
          image,
          updatedAt:new Date(),
        },
      }
    );



    res.status(200).json({
      success:true,
      message:"Service updated successfully",
    });



  } catch(error) {
    next(error);
  }
};


export const deleteService: RequestHandler = async (
  req,
  res,
  next
) => {


  try {


    const id = req.params.id;


    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id)
    ) {

      res.status(400).json({
        success:false,
        message:"Invalid service id",
      });

      return;
    }



    await serviceCollection().deleteOne({
      _id:new ObjectId(id),
    });



    res.status(200).json({
      success:true,
      message:"Service deleted successfully",
    });



  } catch(error) {
    next(error);
  }

};



export const updateServiceStatus: RequestHandler = async (
  req,
  res,
  next
) => {


  try {


    const id = req.params.id;


    if (
      typeof id !== "string" ||
      !ObjectId.isValid(id)
    ) {

      res.status(400).json({
        success:false,
        message:"Invalid service id",
      });

      return;
    }



    const { status } = req.body;



    if (
      status !== "published" &&
      status !== "unpublished"
    ) {

      res.status(400).json({
        success:false,
        message:"Invalid status",
      });

      return;
    }




    await serviceCollection().updateOne(
      {
        _id:new ObjectId(id),
      },
      {
        $set:{
          status,
          updatedAt:new Date(),
        },
      }
    );



    res.status(200).json({
      success:true,
      message:"Service status updated successfully",
    });



  } catch(error) {

    next(error);

  }

};