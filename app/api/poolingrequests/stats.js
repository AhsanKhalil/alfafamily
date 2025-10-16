import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest"; 

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await dbConnect(); // Connect to MongoDB (Ensure you have this function)
      
      // Count documents based on different statuses
      const total = await PoolingRequest.countDocuments(); // Total bookings
      const completed = await PoolingRequest.countDocuments({ status: "accepted" }); // Completed rides
      const cancelled = await PoolingRequest.countDocuments({ status: "cancelled" }); // Cancelled rides

      // Send stats back to the client
      res.status(200).json({
        success: true,
        stats: {
          total,
          completed,
          cancelled,
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
  } else {
    // If the HTTP method is not GET, return a 405 Method Not Allowed
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
