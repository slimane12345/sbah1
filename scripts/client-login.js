
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config for Sbah
const firebaseConfig = {
  apiKey: "AIzaSyDKs7QQjax0FcogazrXOeSExrDxlVlfbBE",
  authDomain: "sbah-ece2e.firebaseapp.com",
  projectId: "sbah-ece2e",
  storageBucket: "sbah-ece2e.firebasestorage.app",
  messagingSenderId: "1018203020293",
  appId: "1:1018203020293:web:3adeab254fab74d234906c",
  measurementId: "G-VKZFW5QPN6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "ar";

// DOM Elements
const phoneEntrySection = document.getElementById("phone-entry");
const otpSection = document.getElementById("otpSection");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const verifyCodeBtn = document.getElementById("verifyCodeBtn");
const phoneNumberInput = document.getElementById("phoneNumber");
const otpCodeInput = document.getElementById("otpCode");
const loginStatus = document.getElementById("loginStatus");

// Setup reCAPTCHA verifier
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  'size': 'invisible', // Use invisible reCAPTCHA
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    // This callback is for v2 invisible reCAPTCHA.
  }
});

// Function to handle sending the verification code
const handleSendCode = async () => {
  const phoneNumber = phoneNumberInput.value.trim();
  if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) { // Simple phone number validation
    loginStatus.textContent = "الرجاء إدخال رقم هاتف صحيح.";
    loginStatus.style.color = "red";
    return;
  }

  loginStatus.textContent = "جاري إرسال الرمز...";
  loginStatus.style.color = "#6E5C3E";
  sendCodeBtn.disabled = true;

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    
    // Switch UI to OTP entry
    phoneEntrySection.classList.add("hidden");
    otpSection.classList.remove("hidden");
    
    loginStatus.textContent = "تم إرسال رمز التحقق بنجاح.";
    loginStatus.style.color = "green";
    otpCodeInput.focus();

  } catch (error) {
    console.error("Error sending OTP:", error);
    loginStatus.textContent = "حدث خطأ. قد يكون رقم الهاتف غير صحيح أو هناك مشكلة في الشبكة.";
    loginStatus.style.color = "red";
    // In case of error, re-render reCAPTCHA
    window.recaptchaVerifier.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId;
    });
  } finally {
    sendCodeBtn.disabled = false;
  }
};

// Function to handle verifying the OTP code
const handleVerifyCode = async () => {
  const code = otpCodeInput.value.trim();
  if (code.length < 6) {
    loginStatus.textContent = "الرجاء إدخال رمز التحقق المكون من 6 أرقام.";
    loginStatus.style.color = "red";
    return;
  }

  loginStatus.textContent = "جاري التحقق...";
  loginStatus.style.color = "#6E5C3E";
  verifyCodeBtn.disabled = true;

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;
    
    loginStatus.textContent = "تم تسجيل الدخول بنجاح! 🎉";
    loginStatus.style.color = "green";
    
    // Store user info and redirect
    localStorage.setItem("sbahUserPhone", user.phoneNumber);
    localStorage.setItem("sbahUserId", user.uid);

    setTimeout(() => {
      // Redirect to the customer dashboard
      window.location.href = "../customerDashboard.html"; 
    }, 1500);

  } catch (error) {
    console.error("Error verifying OTP:", error);
    loginStatus.textContent = "رمز التحقق غير صحيح. الرجاء المحاولة مرة أخرى.";
    loginStatus.style.color = "red";
  } finally {
    verifyCodeBtn.disabled = false;
  }
};

// Event Listeners
sendCodeBtn.addEventListener("click", handleSendCode);
verifyCodeBtn.addEventListener("click", handleVerifyCode);

// Allow pressing Enter to submit
phoneNumberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendCode();
});
otpCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleVerifyCode();
});