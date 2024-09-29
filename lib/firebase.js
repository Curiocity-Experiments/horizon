// lib/firebase.js

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

class FirebaseService {
  constructor() {
    if (!getApps().length) {
      try {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}",
        );
        initializeApp({
          credential: cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        console.log("Firebase Admin initialized successfully");
      } catch (error) {
        console.error("Firebase admin initialization error", error);
      }
    }
    this.db = getFirestore();
  }

  async getFeedbackItems(limit = 10) {
    try {
      const feedbackRef = this.db.collection("feedback");
      const feedbackSnapshot = await feedbackRef
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();
      return feedbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching feedback items:", error);
      throw error;
    }
  }

  async createFeedbackItem(data) {
    try {
      const feedbackRef = this.db.collection("feedback");
      const newFeedbackRef = await feedbackRef.add({
        ...data,
        createdAt: new Date().toISOString(),
        voteCount: 0,
      });
      return newFeedbackRef.id;
    } catch (error) {
      console.error("Error creating feedback item:", error);
      throw error;
    }
  }

  async updateFeedbackItem(id, data) {
    try {
      const feedbackRef = this.db.collection("feedback").doc(id);
      await feedbackRef.update(data);
      return true;
    } catch (error) {
      console.error("Error updating feedback item:", error);
      throw error;
    }
  }

  async deleteFeedbackItem(id) {
    try {
      const feedbackRef = this.db.collection("feedback").doc(id);
      await feedbackRef.delete();
      return true;
    } catch (error) {
      console.error("Error deleting feedback item:", error);
      throw error;
    }
  }

  async getFeedbackItemById(id) {
    try {
      const feedbackRef = this.db.collection("feedback").doc(id);
      const doc = await feedbackRef.get();
      if (!doc.exists) {
        throw new Error("Feedback item not found");
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("Error fetching feedback item:", error);
      throw error;
    }
  }

  async voteFeedbackItem(id, voteType) {
    try {
      const feedbackRef = this.db.collection("feedback").doc(id);
      await this.db.runTransaction(async (transaction) => {
        const doc = await transaction.get(feedbackRef);
        if (!doc.exists) {
          throw new Error("Feedback item not found");
        }
        const newVoteCount =
          doc.data().voteCount + (voteType === "upvote" ? 1 : -1);
        transaction.update(feedbackRef, { voteCount: newVoteCount });
      });
      return true;
    } catch (error) {
      console.error("Error voting on feedback item:", error);
      throw error;
    }
  }
}

const firebaseService = new FirebaseService();
export default firebaseService;
