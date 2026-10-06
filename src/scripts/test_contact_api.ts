import "dotenv/config";
import { connectDatabase } from "../config/database.js";
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../modules/contact/contact.controller.js";
import { contactCollection } from "../modules/contact/contact.model.js";

function mockResponse() {
  let responseData: any = null;
  let statusCode = 200;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
  };

  return {
    res,
    getData: () => responseData,
    getStatus: () => statusCode,
  };
}

async function runTests() {
  await connectDatabase();
  console.log("\n==================================================");
  console.log("TESTING CONTACT BACKEND MODULE");
  console.log("==================================================\n");

  const testEmail = "test.client@dwellora.com";

  // Cleanup any old test entries
  await contactCollection().deleteMany({ email: testEmail });

  // 1. Submit Contact (Public POST /api/contact)
  console.log("--- 1. POST /api/contact (Valid Submission) ---");
  const createMock = mockResponse();
  await (submitContact as any)(
    {
      body: {
        name: "Ayan Test Client",
        email: testEmail,
        phone: "+880 1712 345678",
        service: "Full Home Renovation",
        message: "We would like to request an architectural consultation for our 3,500 sq ft duplex in Gulshan.",
      },
    },
    createMock.res,
    () => {}
  );

  console.log("Status:", createMock.getStatus());
  console.log("Response:", JSON.stringify(createMock.getData(), null, 2));

  if (createMock.getStatus() !== 201 || !createMock.getData()?.contact?._id) {
    throw new Error("Failed to create contact message.");
  }

  const createdId = createMock.getData().contact._id.toString();

  // 2. Validation Error Test (Invalid Email)
  console.log("\n--- 2. POST /api/contact (Validation Error - Invalid Email) ---");
  const invalidMock = mockResponse();
  await (submitContact as any)(
    {
      body: {
        name: "Invalid Client",
        email: "invalid-email-format",
        phone: "12345",
        service: "Custom Carpentry",
        message: "Hello",
      },
    },
    invalidMock.res,
    () => {}
  );
  console.log("Status:", invalidMock.getStatus());
  console.log("Response:", JSON.stringify(invalidMock.getData(), null, 2));

  if (invalidMock.getStatus() !== 400) {
    throw new Error("Validation check failed: expected 400 status.");
  }

  // 3. Get All Contacts (Admin GET /api/contact)
  console.log("\n--- 3. GET /api/contact (Admin List) ---");
  const listMock = mockResponse();
  await (getContacts as any)({}, listMock.res, () => {});
  console.log("Status:", listMock.getStatus());
  console.log(`Count: ${listMock.getData()?.count}`);

  if (listMock.getStatus() !== 200 || !Array.isArray(listMock.getData()?.contacts)) {
    throw new Error("Failed to list contacts.");
  }

  // 4. Get Contact By ID (Admin GET /api/contact/:id)
  console.log("\n--- 4. GET /api/contact/:id ---");
  const getByIdMock = mockResponse();
  await (getContactById as any)(
    { params: { id: createdId } },
    getByIdMock.res,
    () => {}
  );
  console.log("Status:", getByIdMock.getStatus());
  console.log("Fetched Name:", getByIdMock.getData()?.contact?.name);
  console.log("Initial Status:", getByIdMock.getData()?.contact?.status);

  if (getByIdMock.getStatus() !== 200 || getByIdMock.getData()?.contact?.status !== "new") {
    throw new Error("Failed to get contact by ID.");
  }

  // 5. Update Status to 'read' then 'replied' (Admin PATCH /api/contact/:id/status)
  console.log("\n--- 5. PATCH /api/contact/:id/status (Mark as 'replied') ---");
  const updateStatusMock = mockResponse();
  await (updateContactStatus as any)(
    {
      params: { id: createdId },
      body: { status: "replied" },
    },
    updateStatusMock.res,
    () => {}
  );
  console.log("Status:", updateStatusMock.getStatus());
  console.log("Updated Status:", updateStatusMock.getData()?.contact?.status);

  if (
    updateStatusMock.getStatus() !== 200 ||
    updateStatusMock.getData()?.contact?.status !== "replied"
  ) {
    throw new Error("Failed to update contact status.");
  }

  // 6. Delete Contact (Admin DELETE /api/contact/:id)
  console.log("\n--- 6. DELETE /api/contact/:id ---");
  const deleteMock = mockResponse();
  await (deleteContact as any)(
    { params: { id: createdId } },
    deleteMock.res,
    () => {}
  );
  console.log("Status:", deleteMock.getStatus());
  console.log("Response:", JSON.stringify(deleteMock.getData(), null, 2));

  if (deleteMock.getStatus() !== 200) {
    throw new Error("Failed to delete contact.");
  }

  // 7. Verify 404 after deletion
  console.log("\n--- 7. GET /api/contact/:id (Verify 404 after deletion) ---");
  const notFoundMock = mockResponse();
  await (getContactById as any)(
    { params: { id: createdId } },
    notFoundMock.res,
    () => {}
  );
  console.log("Status:", notFoundMock.getStatus());

  if (notFoundMock.getStatus() !== 404) {
    throw new Error("Expected 404 after contact deletion.");
  }

  console.log("\n==================================================");
  console.log("ALL CONTACT MODULE TESTS PASSED SUCCESSFULLY! 🎉");
  console.log("==================================================\n");

  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
