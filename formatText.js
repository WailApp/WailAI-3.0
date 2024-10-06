function formatText() {
  const contentDiv = document.getElementById('message-content');
  if (contentDiv) {
    let text = contentDiv.innerText;  // الحصول على النص الخام

    // كشف النصوص الغامقة والمائلة (***)
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<span class="bold italic">$1</span>');
    
    // كشف النصوص الغامقة (**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
    
    // كشف النصوص المائلة (*)
    text = text.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
    
    // كشف الأكواد (```)
    text = text.replace(/`(.*?)`/g, '<span class="code">$1</span>');

    // تحديث محتوى div بالنص المحدث
    contentDiv.innerHTML = text;
  }
}

// استدعاء الدالة عند تحميل الصفحة
window.onload = formatText;
