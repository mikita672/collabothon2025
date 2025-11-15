import { getDatabase, ref, set, onValue, remove } from 'firebase/database';
import app from '@/firebase';

const database = getDatabase(app);

export class DatabaseService {
  static async writeSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = ref(database, `qr_sessions/${sessionId}`);
      await set(sessionRef, {
        token: '',
        authenticated: false
      });
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  }

  // Listen to session changes for authentication
  static listenToSession(
    sessionId: string, 
    onAuthenticated: (customToken: string) => void
  ): () => void {
    const sessionRef = ref(database, `qr_sessions/${sessionId}`);
    
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Data from database:', data);
      
      if (data && data.authenticated === true && data.token && data.token !== 'waiting') {
        console.log('Session authenticated! Custom Token received');
        onAuthenticated(data.token);
        DatabaseService.removeSession(sessionId);
      } else {
        console.log('Waiting for authentication... authenticated:', data?.authenticated, 'token:', data?.token);
      }
    });

    return unsubscribe;
  }

  static async removeSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = ref(database, `qr_sessions/${sessionId}`);
      await remove(sessionRef);
    } catch (error) {
      console.error('Session error', error);
    }
  }

  static async authenticateSession(
    sessionId: string, 
    token: string
  ): Promise<void> {
    try {
      const sessionRef = ref(database, `qr_sessions/${sessionId}`);
      await set(sessionRef, {
        token: token,
        authenticated: true
      });
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  }
}
