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
            : (language === "ko" ? "전송하기" : "Send")
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

      {/* 소셜 미디어 아이콘 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4">
          {/* 유튜브 아이콘 */}
          <a
            href="https://www.youtube.com/@sndhandpanofficial2990"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
            aria-label="YouTube"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          {/* 인스타그램 아이콘 */}
          <a
            href="https://www.instagram.com/snd_handpan_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            aria-label="Instagram"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

