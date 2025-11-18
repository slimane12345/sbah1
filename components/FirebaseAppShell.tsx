import React, { useState, useEffect } from 'react';
import { auth, firebaseInitializationError } from '../scripts/firebase/firebaseConfig.js';
import { signInAnonymously } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner.tsx';
import ErrorDisplay from './ErrorDisplay.tsx';

const FirebaseAppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState<React.ReactNode | null>(null);

    // 1. Check for synchronous initialization errors from module load
    if (firebaseInitializationError) {
        let detailedMessage: React.ReactNode = `An unexpected Firebase initialization error occurred: ${firebaseInitializationError.message}`;

        if (firebaseInitializationError.message.includes('firestore is not available')) {
            detailedMessage = (
                <>
                  <p className="font-bold">خطأ في إعداد Firebase Firestore</p>
                  <p className="text-sm mt-2">خدمة Firestore غير متاحة. هذا يعني غالبًا أن قاعدة بيانات Firestore لم يتم إنشاؤها في مشروعك على Firebase.</p>
                  <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a>.</li>
                      <li>In the left menu, click <strong>Build</strong> &rarr; <strong>Firestore Database</strong>.</li>
                      <li>Click <strong>Create database</strong>.</li>
                      <li>Choose <strong>Start in production mode</strong> (or test mode).</li>
                      <li>Select a location and click <strong>Enable</strong>.</li>
                    </ol>
                  </div>
                </>
            );
        }
        
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={detailedMessage} />
                </div>
            </div>
        );
    }
    
    // 2. Handle asynchronous initialization (e.g., anonymous auth)
    useEffect(() => {
        const anony_auth = async () => {
          try {
            if (auth && !auth.currentUser) {
              await signInAnonymously(auth);
              console.log("Firebase signed in anonymously.");
            }
            setIsFirebaseReady(true);
          } catch (error: any) {
            if (error.code === 'auth/admin-restricted-operation') {
              setFirebaseError(
                <>
                  <p className="font-bold">خطأ في مصادقة Firebase</p>
                  <p className="text-sm mt-2">ميزة "تسجيل الدخول المجهول" غير مفعلة. هذه الميزة ضرورية لعمل التطبيق بشكل صحيح.</p>
                  <div className="text-left text-sm mt-4 bg-gray-800 text-white p-4 rounded-md font-mono" dir="ltr">
                    <p className="font-semibold">How to fix:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to your Firebase Console.</li>
                      <li>Navigate to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> tab.</li>
                      <li>Find and <strong>enable</strong> the <strong>Anonymous</strong> sign-in provider.</li>
                      <li>Save and refresh this page.</li>
                    </ol>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">Error code: {error.code}</p>
                </>
              );
            } else {
              setFirebaseError(`حدث خطأ غير متوقع في Firebase: ${error.message}`);
            }
            // Still set ready to true to show the error screen instead of loading forever
            setIsFirebaseReady(true);
          }
        };
        anony_auth();
      }, []);

    // 3. Render loading/error/content based on state
    if (!isFirebaseReady) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (firebaseError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                <div className="max-w-2xl w-full">
                    <ErrorDisplay message={firebaseError} />
                </div>
            </div>
        );
    }
    
    // 4. If all checks pass, render the app
    return <>{children}</>;
};

export default FirebaseAppShell;
