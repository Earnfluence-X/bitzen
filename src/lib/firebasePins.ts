import { db, auth, doc, setDoc, getDoc, deleteDoc, updateDoc } from './firebase';

export async function createFirebasePIN(amount: number, senderId: string): Promise<string | null> {
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    console.error("❌ User not logged into Firebase!");
    return null;
  }
  
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    await setDoc(doc(db, 'transferPins', code), {
      code: code,
      amount: amount,
      senderId: firebaseUser.uid,
      senderEmail: firebaseUser.email,
      expiresAt: expiresAt,
      isUsed: false,
      createdAt: Date.now()
    });
    
    console.log("✅ PIN saved to cloud:", code);
    return code;
  } catch (error: any) {
    console.error('❌ Error creating PIN:', error?.message);
    return null;
  }
}

export async function claimFirebasePIN(code: string, receiverId: string) {
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    return { success: false, message: 'Not logged in' };
  }
  
  try {
    const pinRef = doc(db, 'transferPins', code);
    const pinSnap = await getDoc(pinRef);
    
    if (!pinSnap.exists()) {
      return { success: false, message: 'Invalid PIN code' };
    }
    
    const pinData = pinSnap.data();
    
    if (pinData.isUsed) {
      return { success: false, message: 'PIN already used' };
    }
    
    if (Date.now() > pinData.expiresAt) {
      await deleteDoc(pinRef);
      return { success: false, message: 'PIN has expired' };
    }
    
    await updateDoc(pinRef, { isUsed: true });
    
    // Clean up after 1 second
    setTimeout(async () => {
      await deleteDoc(pinRef);
    }, 1000);
    
    return {
      success: true,
      amount: pinData.amount,
      senderId: pinData.senderId,
    };
  } catch (error: any) {
    console.error('❌ Error claiming PIN:', error?.message);
    return { success: false, message: error?.message };
  }
}