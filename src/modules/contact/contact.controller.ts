import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { contactCollection, type Contact, type ContactStatus } from "./contact.model.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getParamString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  return "";
}

function parseContactInput(body: unknown) {
  if (!isObject(body)) {
    throw new Error("Invalid contact form data.");
  }

  const requiredText = (field: string) => {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} is required.`);
    }
    return value.trim();
  };

  const name = requiredText("name");
  const email = requiredText("email").toLowerCase();
  const phone = requiredText("phone");
  const service = requiredText("service");
  const message = requiredText("message");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please provide a valid email address.");
  }

  return {
    name,
    email,
    phone,
    service,
    message,
  };
}

// POST /api/contact - Public contact submission
export const submitContact: RequestHandler = async (req, res, next) => {
  try {
    const parsed = parseContactInput(req.body);

    const newContact: Contact = {
      ...parsed,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contactCollection().insertOne(newContact as any);

    res.status(201).json({
      success: true,
      message: "Thank you for contacting Dwellora. We will get back to you shortly.",
      contact: {
        _id: result.insertedId,
        ...newContact,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

// GET /api/contact - Admin: Get all contact messages
export const getContacts: RequestHandler = async (_req, res, next) => {
  try {
    const contacts = await contactCollection()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact/:id - Admin: Get single contact message
export const getContactById: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID format.",
      });
      return;
    }

    const contact = await contactCollection().findOne({ _id: new ObjectId(id) });

    if (!contact) {
      res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contact/:id/status - Admin: Update status
export const updateContactStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID format.",
      });
      return;
    }

    const { status } = req.body;
    const allowedStatuses: ContactStatus[] = ["new", "read", "replied"];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Status must be 'new', 'read', or 'replied'.",
      });
      return;
    }

    const result = await contactCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully.",
      contact: result,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/contact/:id - Admin: Delete contact message
export const deleteContact: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid contact ID format.",
      });
      return;
    }

    const result = await contactCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
