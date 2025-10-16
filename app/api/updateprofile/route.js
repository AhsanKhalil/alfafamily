import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserInformation from "@/models/UserInformation";
import Employee from "@/models/Employee";
import Vehicle from "@/models/Vehicle";
import { logUserActivity } from "@/lib/logActivity";

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      userId,
      profilePic,
      email,
      mobileNo1,
      whatsAppNo1,
      address1,
      cnic,
      department,
      designation,
      vehicleName,
      vehicleModel,
      vehicleColor,
      vehicleRegNo,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // ✅ 1. Update or Insert UserInformation
    await UserInformation.findOneAndUpdate(
      { userId },
      {
        $set: { profilePic, email, mobileNo1, whatsAppNo1, address1 },
        $setOnInsert: { userId, createdOn: new Date() },
      },
      { new: true, upsert: true }
    );

    // ✅ 2. Only update Employee — don’t upsert (avoids empid duplicate error)
    const employeeUpdateFields = {};
    if (cnic) employeeUpdateFields.cnic = cnic;
    if (department) employeeUpdateFields.department = department;
    if (designation) employeeUpdateFields.designation = designation;

    if (Object.keys(employeeUpdateFields).length > 0) {
      await Employee.findOneAndUpdate(
        { createdBy: userId },
        { $set: employeeUpdateFields },
        { new: true } // ⚠️ no upsert
      );
    }

    // ✅ 3. Update or Insert Vehicle (if user is a Driver)
    const vehicleUpdateFields = {};
    if (vehicleName) vehicleUpdateFields.name = vehicleName;
    if (vehicleModel) vehicleUpdateFields.model = vehicleModel;
    if (vehicleColor) vehicleUpdateFields.color = vehicleColor;
    if (vehicleRegNo) vehicleUpdateFields.registrationNo = vehicleRegNo;

    if (Object.keys(vehicleUpdateFields).length > 0) {
      await Vehicle.findOneAndUpdate(
        { owner: userId },
        {
          $set: vehicleUpdateFields,
          $setOnInsert: { owner: userId, createdOn: new Date() },
        },
        { new: true, upsert: true }
      );
    }
    await logUserActivity({
  userId,
  eventPerformed: "Profile Update",
  activityDetail: "User updated profile information",
  ipAddress: req.headers.get("x-forwarded-for"),
  deviceInfo: req.headers.get("user-agent"),
});


    return NextResponse.json({
      success: true,
      message: "Profile updated successfully ✅",
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
