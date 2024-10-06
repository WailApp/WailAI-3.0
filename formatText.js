    function formatText() {
      // الحصول على كل محتويات الصفحة
      const bodyContent = document.body;

      if (bodyContent) {
        let text = bodyContent.innerHTML;  // الحصول على المحتوى كـ HTML

        // كشف النصوص الغامقة والمائلة (***)
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<span class="bold italic">$1</span>');
        
        // كشف النصوص الغامقة (**)
        text = text.replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>');
        
        // كشف النصوص المائلة (*)
        text = text.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
        
        // كشف الأكواد (```)
        text = text.replace(/```(.*?)```/g, '<span class="code">$1</span>');

        // تحديث محتوى الصفحة بالكامل بالنص المحدث
        bodyContent.innerHTML = text;
      }
    }
