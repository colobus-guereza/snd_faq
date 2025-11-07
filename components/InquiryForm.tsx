"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useLanguage } from "@/contexts/LanguageContext";

interface InquiryFormProps {
  recipientEmail?: string;
}

export default function InquiryForm({ recipientEmail = "handpansnd@gmail.com" }: InquiryFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // EmailJS 설정 (환경변수에서 가져오거나 직접 입력)
  // 실제 사용 시 .env.local 파일에 다음을 추가하세요:
  // NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
  // NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
  // NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
  
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId || !templateId || !publicKey) {
      alert(language === "ko" 
        ? "이메일 서비스가 설정되지 않았습니다. 관리자에게 문의하세요." 
        : "Email service is not configured. Please contact administrator.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: recipientEmail,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        },
        publicKey
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // 5초 후 성공 메시지 숨김
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {language === "ko" ? "문의하기" : "Contact Us"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {language === "ko" ? "이름" : "Name"}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
            placeholder={language === "ko" ? "이름을 입력하세요" : "Enter your name"}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {language === "ko" ? "이메일" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
            placeholder={language === "ko" ? "이메일을 입력하세요" : "Enter your email"}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {language === "ko" ? "문의 내용" : "Message"}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent resize-none"
            placeholder={language === "ko" ? "문의 내용을 입력하세요" : "Enter your message"}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-[#14B8A6] text-white font-medium rounded-lg hover:bg-[#0d9488] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? (language === "ko" ? "전송 중..." : "Sending...")
            : (language === "ko" ? "문의하기" : "Send Inquiry")
          }
        </button>

        {submitStatus === "success" && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
            {language === "ko" 
              ? "문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다." 
              : "Your inquiry has been sent successfully. We will reply soon."}
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {language === "ko" 
              ? "전송 중 오류가 발생했습니다. 이메일(handpansnd@gmail.com)로 직접 문의해주세요." 
              : "An error occurred while sending. Please contact us directly at handpansnd@gmail.com"}
          </div>
        )}
      </form>
    </div>
  );
}

