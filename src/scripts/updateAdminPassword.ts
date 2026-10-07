import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase, getDatabase } from "../config/database.js";

async function updateAdminPassword() {
  const args = process.argv.slice(2);
  const newPassword = args[0] || process.env.NEW_ADMIN_PASSWORD;
  const targetEmail = args[1] || process.env.ADMIN_EMAIL;

  if (!newPassword || newPassword.trim() === "") {
    console.error("==================================================");
    console.error("Error: New password is required.");
    console.error("");
    console.error("Usage:");
    console.error("  npm run update-password -- <new_password> [email]");
    console.error("  npx tsx src/scripts/updateAdminPassword.ts <new_password> [email]");
    console.error("");
    console.error("Example:");
    console.error("  npm run update-password -- MyNewSecretPass123! admin@dwellora.com");
    console.error("==================================================");
    process.exit(1);
  }

  try {
    await connectDatabase();
    const db = getDatabase();
    const adminsCollection = db.collection("admins");

    // Find admin by specific email or pick the first registered admin
    let query: Record<string, any> = {};
    if (targetEmail && targetEmail.trim()) {
      query.email = targetEmail.trim().toLowerCase();
    }

    const admin = await adminsCollection.findOne(query);

    if (!admin) {
      console.error(`Error: No admin user found matching the criteria.`);
      const allAdmins = await adminsCollection.find({}, { projection: { email: 1, name: 1, role: 1 } }).toArray();
      if (allAdmins.length > 0) {
        console.log("Existing admin accounts found in database:");
        allAdmins.forEach((a) => console.log(` - ${a.email} (${a.name || "Admin"})`));
      } else {
        console.log("No admin accounts found. You can run 'npm run create-admin' first.");
      }
      process.exit(1);
    }

    // Hash the new password with bcrypt (10 rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword.trim(), saltRounds);

    // Update the password in MongoDB
    await adminsCollection.updateOne(
      { _id: admin._id },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    console.log("==================================================");
    console.log(`✓ Password updated successfully for: ${admin.email}`);
    console.log("✓ Encrypted with bcrypt (10 salt rounds)");
    console.log("✓ You can now log in with the new password.");
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to update admin password:", error);
    process.exit(1);
  }
}

updateAdminPassword();
