// العناصر من DOM
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const deleteChatButton = document.querySelector("#delete-chat-button");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const sendMessageButton = document.querySelector("#send-message-button");

// المتغيرات الحالة
let userMessage = null;
let isResponseGenerating = false;

// API configuration
const API_KEY = "AIzaSyD3-ZBYS3ecvTjFJY8ac_SqneJp8kBtxPk"; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// وظيفة لتطبيق الثيم بناءً على localStorage أو تفضيلات النظام
const applyTheme = () => {
  const storedTheme = localStorage.getItem("themeColor");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = storedTheme === "dark_mode" || (storedTheme === null && prefersDarkScheme);

  document.body.classList.toggle("dark_mode", isDarkMode);
  document.body.classList.toggle("light_mode", !isDarkMode);
};

// تحميل البيانات وتطبيق الثيم عند تحميل الصفحة
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats");
  applyTheme();
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// إنشاء عنصر رسالة جديد وإرجاعه
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// عرض تأثير الكتابة بإظهار الكلمات واحدة تلو الأخرى
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // حفظ الدردشات في localStorage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }, 75);
};

// جلب الرد من API بناءً على رسالة المستخدم
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }]
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    let apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    apiResponse = apiResponse.replace(/جوجل/gi, "WailTech");
    apiResponse = apiResponse.replace(/google/gi, "WailTech");
    apiResponse = apiResponse.replace(/Gemini/gi, "WailAI");

    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

// عرض الرسوم المتحركة أثناء الانتظار لرد API
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="images/chatbot3.0.png" alt="WailAI">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>
               `;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv);
};

// وظيفة التحقق من الاشتراك وحدود الرسائل قبل إرسال الرسالة
const checkSubscriptionAndHandleOutgoingChat = async () => {
  const userDocRef = firestore.collection('users').doc(auth.currentUser.uid);
  try {
    const doc = await userDocRef.get();
    if (doc.exists) {
      const userData = doc.data();
      const subscription = userData?.subscription;
      const subscriptionEnd = userData?.subscriptionEnd ? userData.subscriptionEnd.toDate() : null;
      let messageCount = userData?.messageCount || 0;

      const now = new Date();

      if ((subscription === 'plus' || subscription === 'team') && (subscriptionEnd === null || subscriptionEnd > now)) {
        console.log(`User has a valid ${subscription} subscription.`);
        // يمكن للمستخدم إرسال رسائل دون قيود
        handleOutgoingChat();
      } else {
        console.log('User does not have a valid subscription or the subscription has expired.');
        if (messageCount >= 20) { // الحد الأقصى للرسائل
          displayErrorMessage("You have exceeded the maximum number of allowed messages. Please upgrade your plan.");
          isResponseGenerating = false; // إيقاف توليد الرد
          sendMessageButton.disabled = true; // تعطيل زر الإرسال
          typingForm.querySelector(".typing-input").disabled = true; // تعطيل حقل الإدخال
        } else {
          // زيادة العداد وحفظه ثم إرسال الرسالة
          messageCount++;
          await userDocRef.update({ messageCount }); // تحديث عدد الرسائل في Firebase
          handleOutgoingChat();
        }
      }
    } else {
      console.log('No such document!');
      // معالجة المستخدمين الذين ليس لديهم مستند في قاعدة البيانات (يمكنك تنفيذ إجراءات إضافية هنا)
    }
  } catch (error) {
    console.error('Error getting document:', error);
    // معالجة الخطأ (يمكنك تنفيذ إجراءات إضافية هنا)
  }
};


// عرض رسالة الخطأ في واجهة المستخدم مع زر إغلاق
const displayErrorMessage = (message) => {
  const errorMessageDiv = document.createElement("div");
  errorMessageDiv.classList.add("error-message");

  // إضافة النص والزر
  errorMessageDiv.innerHTML = `
    <span class="error-text">${message}</span>
    <button class="error-button" onclick="window.location.href='update.html'">Get Pro</button>
    <button class="error-close-button" onclick="this.parentElement.remove()">×</button>
  `;

  document.body.appendChild(errorMessageDiv);

  // جعل الرسالة تختفي بعد 5 ثوانٍ
  setTimeout(() => {
    errorMessageDiv.remove();
  }, 5000);
};

// إضافة CSS لتنسيق رسالة الخطأ وزر الإغلاق
const style = document.createElement('style');
style.textContent = `
.error-message {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--secondary-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  z-index: 1000;
  margin-bottom: 105px;
  align-items: center;
  justify-content: center;
}


  .error-text {
	font-family: "Manrope", sans-serif;
    align-items: center;
    flex: 1;
  }
  .error-button{
  font-family: 'Manrope', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 09px 16px;
  font-size: 16px; /* Adjust font size */
  font-weight: 500;
  line-height: 1.75;
  border-radius: 30px; /* Slightly rounded corners */
  border: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, box-shadow 0.3s;
  width: auto; /* Full width for better layout */
  margin-left: 15px;
  background-color: #387cff; /* Google blue color */
  color: white;
  }

  .error-close-button {
	width: 30px;
    height: 30px;
    background: var(--primary-color);
	border-radius: 15px;
    border: none;
    color: var(--text-color);
	align-items: center;
    align-items: center;
    font-size: 20px;
    margin-left: 15px;
  }

  .error-close-button:hover {
	align-items: center;
    align-items: center;
    color: #d32f2f;
  }
@media (max-width: 768px){
	.error-message {
	left: 0%;
    transform: translateX(-0%);
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: var(--secondary-color);
    color: var(--text-color);
    padding: 20px;
    border-radius: 20px;
    display: flex;
    z-index: 1000;
	margin-bottom: 120px;
	margin-left: 15px;
	margin-right: 15px;
	align-items: center;
	justify-content: center;
  }  
}
`;
document.head.appendChild(style);

const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating || sendMessageButton.disabled) return;

  isResponseGenerating = true;

  const html = `<div class="message-content">
                  <img class="avatar" src="images/user.jpg" alt="User avatar">
                  <p class="text"></p>
                </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);

  typingForm.reset();
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showLoadingAnimation, 500);
};


// حذف جميع الدردشات من localStorage عند النقر على الزر
const deleteChats = () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
};

// تعيين رسالة المستخدم والتعامل مع الدردشة الصادرة عند النقر على الاقتراحات
const handleSuggestionClick = (suggestion) => {
  userMessage = suggestion.querySelector(".text").innerText;
  checkSubscriptionAndHandleOutgoingChat();
};

// منع إرسال النموذج الافتراضي والتعامل مع الدردشة الصادرة
const handleFormSubmit = (e) => {
  e.preventDefault();
  checkSubscriptionAndHandleOutgoingChat();
};

// إعدادات الأحداث
window.addEventListener('load', loadDataFromLocalstorage);
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("themeColor");
    const newTheme = currentTheme === "dark_mode" ? "light_mode" : "dark_mode";
    localStorage.setItem("themeColor", newTheme);
    applyTheme();
  });
}

if (deleteChatButton) {
  deleteChatButton.addEventListener("click", deleteChats);
}

if (suggestions.length > 0) {
  suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => handleSuggestionClick(suggestion));
  });
}

if (typingForm) {
  typingForm.addEventListener("submit", handleFormSubmit);
}

if (sendMessageButton) {
  sendMessageButton.addEventListener("click", checkSubscriptionAndHandleOutgoingChat);
}

// منع الإرسال عند الضغط على Enter إذا كان الزر معطلًا
typingForm.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && sendMessageButton.disabled) {
    e.preventDefault();
    displayErrorMessage("You have exceeded the maximum number of allowed messages. Please upgrade your plan.");
  }
});
