import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";

// Load Firebase Service Account Key
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-url.firebaseio.com", // Replace with your Firebase DB URL
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// 📌 API: Place an Order (Customer Side)
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = {
      ...req.body,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await db.collection("orders").add(newOrder);
    console.log("✅ New Order Placed:", newOrder);
    res.json({ success: true, message: "Order saved successfully!", id: docRef.id });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ success: false, message: "Error saving order" });
  }
});

// 📌 API: Fetch All Orders (Admin Side)
app.get("/api/orders", async (req, res) => {
  try {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log("📥 Admin Dashboard Orders:", orders);
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
