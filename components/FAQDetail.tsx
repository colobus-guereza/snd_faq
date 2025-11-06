"use client";

import Link from "next/link";
import { FAQ } from "@/types/faq";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQDetailProps {
  faq: FAQ;
  returnCategory?: string;
}

export default function FAQDetail({ faq, returnCategory }: FAQDetailProps) {
  const { language, t, getFAQ } = useLanguage();
  const backHref = returnCategory 
    ? `/?category=${encodeURIComponent(returnCategory)}`
    : "/";
  
  // "문의/제안" 카테고리 질문(id: "7")은 뒤로가기 버튼 숨김
  const isInquiryPage = faq.id === "7";
  
  // "1.2mm 스테인레스를 사용하는 이유" 질문(id: "14")은 도표 표시
  const isStainlessPage = faq.id === "14";
  
  // 영어일 경우 번역된 FAQ 데이터 사용
  const translatedFAQ = getFAQ(faq.id);
  
  // "문의/제안" 카테고리 질문은 타이틀 변경
  const displayTitle = isInquiryPage 
    ? t("문의와 제안")
    : (translatedFAQ ? translatedFAQ.title : faq.title);
  
  // 번역된 내용 사용
  const displayContent = translatedFAQ ? translatedFAQ.content : faq.content;
  const displayTags = translatedFAQ ? translatedFAQ.tags : faq.tags;
  
  // URL 복사 상태 관리
  const [copied, setCopied] = useState(false);
  
  // 현재 페이지 URL 복사 함수
  const handleShareClick = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      // 2초 후 복사 완료 메시지 숨김
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("URL 복사 실패:", err);
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full">
      {!isInquiryPage && (
        <Link
          href={backHref}
          prefetch={true}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">{t("질문 목록")}</span>
        </Link>
      )}

      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {displayTitle}
        </h1>
        <button
          onClick={handleShareClick}
          className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={t("링크 공유하기")}
          title={copied ? t("복사됨!") : t("링크 공유하기")}
        >
          {copied ? (
            <svg
              className="w-5 h-5 text-[#14B8A6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          )}
        </button>
      </div>

      {!isInquiryPage && displayTags && displayTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {displayTags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 1.2mm 스테인레스 질문 페이지 도표 - 항상 표시 */}
      {isStainlessPage && (
        <div className="prose prose-sm max-w-none mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            {/* 차트 제목 */}
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {language === "ko" ? "쉘 구조·기계적 특성 비교" : "Shell Structure·Mechanical Properties Comparison"}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2 mb-6">
                {language === "ko" ? "상대값 (1.0mm 기준)" : "Relative Value (Based on 1.0mm)"}
              </p>
            </div>

            {/* 범례 */}
            <div className="flex justify-end mb-4">
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-400 opacity-30"></div>
                  <span className="text-gray-700 dark:text-gray-300">1.0 mm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-500 opacity-100"></div>
                  <span className="text-gray-700 dark:text-gray-300">1.2 mm</span>
                </div>
              </div>
            </div>

            {/* 차트 영역 - 명확한 좌표계: 0.0부터 시작 */}
            <div className="relative" style={{ height: '300px' }}>
              {/* Y축 라벨 및 그리드 */}
              <div className="ml-12 relative" style={{ height: '240px', paddingBottom: '60px' }}>
                {/* Y축 라벨 */}
                <div className="absolute left-[-48px] top-0 flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 pr-2" style={{ height: '240px', width: '40px' }}>
                  {[1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.0].map((value) => {
                    const position = ((1.8 - value) / 1.8) * 240;
                    return (
                      <div 
                        key={value} 
                        className="absolute flex items-center" 
                        style={{ 
                          top: `${position}px`,
                          transform: 'translateY(-50%)'
                        }}
                      >
                        <span>{value.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 그리드 라인 */}
                <div className="absolute inset-0" style={{ height: '240px' }}>
                  {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((value) => {
                    const position = ((1.8 - value) / 1.8) * 240;
                    return (
                      <div
                        key={value}
                        className="absolute left-0 right-0 border-t border-dashed border-gray-300 dark:border-gray-700"
                        style={{
                          top: `${position}px`
                        }}
                      ></div>
                    );
                  })}
                </div>

                {/* 바 차트 - 0.0에서 정확히 시작 */}
                <div className="absolute top-0 left-0 right-0" style={{ height: '240px' }}>
                  {/* 막대들 */}
                  <div className="absolute inset-0 flex justify-around px-2">
                    {[
                      { value1: 1.0, value2: 1.73, label: language === "ko" ? "굽힘강성 D" : "Bending Stiffness D" },
                      { value1: 1.0, value2: 1.2, label: language === "ko" ? "면밀도 ρA" : "Area Density ρA" },
                      { value1: 1.0, value2: 1.2, label: language === "ko" ? "막(인장)강성" : "Membrane Stiffness" },
                      { value1: 1.0, value2: 1.44, label: language === "ko" ? "항복 모멘트" : "Yield Moment" },
                      { value1: 1.0, value2: 1.44, label: language === "ko" ? "좌굴 임계하중" : "Buckling Load" },
                      { value1: 1.0, value2: 1.2, label: language === "ko" ? "고유진동수 ƒ" : "Natural Freq. ƒ" }
                    ].map((item, index) => (
                      <div key={index} className="flex-1 max-w-[60px] relative" style={{ height: '240px' }}>
                        {/* 막대 쌍 - 절대 위치로 각각 배치 */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[50px] relative" style={{ height: '240px' }}>
                          {/* 1.0mm 막대 */}
                          <div
                            className="bg-gray-400 opacity-30 rounded-t absolute bottom-0"
                            style={{ 
                              width: '48%', 
                              height: `${(item.value1 / 1.8) * 240}px`,
                              left: '0'
                            }}
                          ></div>
                          {/* 1.2mm 막대 */}
                          <div
                            className="bg-gray-500 opacity-100 rounded-t absolute bottom-0"
                            style={{ 
                              width: '48%', 
                              height: `${(item.value2 / 1.8) * 240}px`,
                              right: '0'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 라벨들 - 별도로 배치 */}
                  <div className="absolute left-0 right-0 flex justify-around px-2" style={{ top: '248px' }}>
                    {[
                      language === "ko" ? "굽힘강성 D" : "Bending Stiffness D",
                      language === "ko" ? "면밀도 ρA" : "Area Density ρA",
                      language === "ko" ? "막(인장)강성" : "Membrane Stiffness",
                      language === "ko" ? "항복 모멘트" : "Yield Moment",
                      language === "ko" ? "좌굴 임계하중" : "Buckling Load",
                      language === "ko" ? "고유진동수 ƒ" : "Natural Freq. ƒ"
                    ].map((label, index) => (
                      <div key={index} className="flex-1 max-w-[60px] text-center">
                        <span className="text-[10px] text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 요약 텍스트 */}
          <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong className="font-semibold">{language === "ko" ? "요약:" : "Summary:"}</strong>{" "}
              {language === "ko" 
                ? "1.2 mm는 1.0 mm 대비 굽힘강성 +73%, 면밀도 +20%, 막(인장)강성 +20%, 좌굴·찌그러짐 내성 +44%. 같은 재질·직경이면 고유진동수는 대략 +20% 상승"
                : "1.2 mm shows +73% bending stiffness, +20% area density, +20% membrane (tensile) stiffness, and +44% buckling/dent resistance compared to 1.0 mm. With the same material and diameter, natural frequency increases by approximately +20%."
              }
            </p>
          </div>

          {/* 파라미터 설명 */}
          <div className="mt-6 pl-6 border-l-2 border-gray-300 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-400 italic">
            <p className="mb-2 text-[10px] font-medium text-gray-500 dark:text-gray-500 not-italic">
              {language === "ko" ? "※ 참고" : "※ Note"}
            </p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "굽힘강성 D" : "Bending Stiffness D"}:</strong> {language === "ko" ? "쉘의 휘어짐 저항. 두께 세제곱에 비례." : "Shell's bending resistance. Proportional to the cube of thickness."} <span className="font-mono not-italic">(D = Eh³ / 12(1 - ν²))</span></p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "면밀도 ρA" : "Area Density ρA"}:</strong> {language === "ko" ? "단위면적당 질량. 두께 1차 비례." : "Mass per unit area. Directly proportional to thickness."} <span className="font-mono not-italic">(ρA = ρh)</span></p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "막(인장)강성" : "Membrane (Tensile) Stiffness"}:</strong> {language === "ko" ? "스피닝·튜닝 시 펴짐/늘어짐 저항. 얇을수록 늘어남 큼." : "Resistance to stretching/elongation during spinning/tuning. Greater elongation with thinner material."} <span className="font-mono not-italic">(~ Eh)</span></p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "항복 모멘트" : "Yield Moment"}:</strong> {language === "ko" ? "충격·국부 눌림에 대한 내성 증가." : "Increased resistance to impact and local indentation."} <span className="font-mono not-italic">(~ σy h²)</span></p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "좌굴 임계하중" : "Buckling Critical Load"}:</strong> {language === "ko" ? "압축·잔류응력에서 형상 안정성." : "Shape stability under compression and residual stress."} <span className="font-mono not-italic">(∝ h²)</span></p>
            <p><strong className="text-gray-700 dark:text-gray-300 not-italic">{language === "ko" ? "고유진동수 ƒ" : "Natural Frequency ƒ"}:</strong> {language === "ko" ? "같은 지름·경계조건이면 전반적 모드 주파수 상승." : "Overall mode frequency increase with same diameter and boundary conditions."} <span className="font-mono not-italic">(ƒ ∝ h)</span></p>
          </div>

          {/* 비교 시각 자료 */}
          <div className="mt-8 space-y-6">
            {/* 정량적 지표 - 통합 막대 그래프 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                {language === "ko" ? "구조·기계적 특성에 따른 음향·기능적 성능 지표 비교" : "Acoustic·Functional Performance Index Comparison Based on Structural·Mechanical Properties"}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-6">
                {language === "ko" ? "상대값 (1.0mm 기준)" : "Relative Value (Based on 1.0mm)"}
              </p>

              {/* 범례 */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-400 opacity-30"></div>
                    <span className="text-gray-700 dark:text-gray-300">1.0 mm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-500 opacity-100"></div>
                    <span className="text-gray-700 dark:text-gray-300">1.2 mm</span>
                  </div>
                </div>
              </div>

              {/* 통합 막대 그래프 - 상단 그래프와 동일한 스타일 */}
              <div className="relative" style={{ height: '300px' }}>
                {/* Y축 라벨 및 그리드 */}
                <div className="ml-12 relative" style={{ height: '240px', paddingBottom: '60px' }}>
                  {/* Y축 라벨 */}
                  <div className="absolute left-[-48px] top-0 flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 pr-2" style={{ height: '240px', width: '40px' }}>
                    {[1.8, 1.6, 1.4, 1.2, 1.0, 0.8, 0.6, 0.4, 0.2, 0.0].map((value) => {
                      const position = ((1.8 - value) / 1.8) * 240;
                      return (
                        <div 
                          key={value} 
                          className="absolute flex items-center" 
                          style={{ 
                            top: `${position}px`,
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <span>{value.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* 그리드 라인 */}
                  <div className="absolute inset-0" style={{ height: '240px' }}>
                    {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((value) => {
                      const position = ((1.8 - value) / 1.8) * 240;
                      return (
                        <div
                          key={value}
                          className="absolute left-0 right-0 border-t border-dashed border-gray-300 dark:border-gray-700"
                          style={{
                            top: `${position}px`
                          }}
                        ></div>
                      );
                    })}
                  </div>

                  {/* 바 차트 - 0.0에서 정확히 시작 */}
                  <div className="absolute top-0 left-0 right-0" style={{ height: '240px' }}>
                    {/* 막대들 */}
                    <div className="absolute inset-0 flex justify-around px-2">
                      {[
                        { 
                          name: language === "ko" ? "피치 안정성" : "Pitch Stability",
                          nameShort: language === "ko" ? "피치 안정성" : "Pitch",
                          value1: 1.0, 
                          value2: 1.58
                        },
                        { 
                          name: language === "ko" ? "공진 특성" : "Resonance",
                          nameShort: language === "ko" ? "공진 특성" : "Resonance",
                          value1: 1.0, 
                          value2: 1.2
                        },
                        { 
                          name: language === "ko" ? "구동 용이성" : "Ease of Driving",
                          nameShort: language === "ko" ? "구동 용이성" : "Driving",
                          value1: 1.0, 
                          value2: 0.83
                        },
                        { 
                          name: language === "ko" ? "왜곡 저항" : "Distortion Resistance",
                          nameShort: language === "ko" ? "왜곡 저항" : "Distortion",
                          value1: 1.0, 
                          value2: 1.44
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex-1 max-w-[80px] relative" style={{ height: '240px' }}>
                          {/* 막대 쌍 - 절대 위치로 각각 배치 */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[60px] relative" style={{ height: '240px' }}>
                            {/* 1.0mm 막대 */}
                            <div
                              className="bg-gray-400 opacity-30 rounded-t absolute bottom-0"
                              style={{ 
                                width: '48%', 
                                height: `${(item.value1 / 1.8) * 240}px`,
                                left: '0'
                              }}
                            ></div>
                            {/* 1.2mm 막대 */}
                            <div
                              className="bg-gray-500 opacity-100 rounded-t absolute bottom-0"
                              style={{ 
                                width: '48%', 
                                height: `${(item.value2 / 1.8) * 240}px`,
                                right: '0'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 라벨들 - 별도로 배치 */}
                    <div className="absolute left-0 right-0 flex justify-around px-2" style={{ top: '248px' }}>
                      {[
                        language === "ko" ? "피치 안정성" : "Pitch Stability",
                        language === "ko" ? "공진 특성" : "Resonance",
                        language === "ko" ? "구동 용이성" : "Ease of Driving",
                        language === "ko" ? "왜곡 저항" : "Distortion Resistance"
                      ].map((label, index) => (
                        <div key={index} className="flex-1 max-w-[80px] text-center">
                          <span className="text-[10px] text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 수식 및 해석 */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {language === "ko" ? "피치 안정성:" : "Pitch Stability:"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                    √(굽힘강성비 × 좌굴내성비)
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {language === "ko" ? "두께↑ → 톤필드 형상 유지 용이, 드리프트 저항↑" : "Increased thickness → Easier to maintain tone field shape, Increased drift resistance"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {language === "ko" ? "공진 특성:" : "Resonance:"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                    f ∝ h
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {language === "ko" ? "동일 형상·재질이면 모드 주파수 ≈ 20% 상승" : "If shape and material are the same, mode frequency increases by approximately 20%"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {language === "ko" ? "구동 용이성:" : "Ease of Driving:"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                    {language === "ko" ? "1 / 면밀도 (ρA)" : "1 / Area Density (ρA)"}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {language === "ko" ? "1.0 mm가 적은 에너지로 잘 울림" : "1.0 mm resonates well with less energy"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {language === "ko" ? "왜곡 저항:" : "Distortion Resistance:"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                    {language === "ko" ? "항복 모멘트 ∝ h²" : "Yield Moment ∝ h²"}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {language === "ko" ? "1.2 mm가 센 어택·충격에서 안정" : "1.2 mm is stable against strong attack and impact"}
                  </p>
                </div>
              </div>

              {/* 요약 및 결론 */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {/* 요약 */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {language === "ko" ? "요약" : "Summary"}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {language === "ko" 
                      ? "1.2 mm 쉘은 1.0 mm 대비 전반적으로 '견고하고 명료한 구조 음향 특성'을 보인다."
                      : "The 1.2 mm shell generally shows 'robust and clear structural acoustic characteristics' compared to the 1.0 mm shell."
                    }
                  </p>
                </div>

                {/* 상세 특성 */}
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {language === "ko" ? "상세 특성" : "Detailed Characteristics"}
                  </p>
                  <ul className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "피치 안정성 +58%:" : "Pitch Stability +58%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "굽힘강성과 좌굴내성이 높아, 온도·타격·시간 변화에도 음정이 안정적이다."
                          : "Due to high bending stiffness and buckling resistance, the pitch remains stable even with changes in temperature, impact, and time."
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "공진 특성 +20%:" : "Resonance Characteristics +20%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "두께 증가로 공진 모드 주파수가 상승, 음색이 더 선명하고 집중된다."
                          : "Increased thickness raises the resonant mode frequency, making the timbre clearer and more focused."
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "왜곡 저항 +44%:" : "Distortion Resistance +44%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "항복모멘트 증가로 강한 어택에서도 형태 변형이 적다."
                          : "Increased yield moment results in less deformation even with strong attacks."
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "구동 용이성 -17%:" : "Ease of Driving -17%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "면밀도 증가로 같은 에너지에서 진폭이 약간 줄며, 반응성은 낮지만 포커스가 향상된다."
                          : "Increased surface density slightly reduces amplitude with the same energy; responsiveness is lower, but focus is improved."
                        }
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 결론 */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {language === "ko" ? "결론" : "Conclusion"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[60px]">1.2 mm:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === "ko" 
                          ? "정확도·내구성·포커스 중심의 \"프로페셔널 톤\""
                          : "Accuracy, durability, focus-centric \"Professional Tone\""
                        }
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[60px]">1.0 mm:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === "ko" 
                          ? "감응성·부드러움 중심의 \"표현력 톤\""
                          : "Responsiveness, softness-centric \"Expressive Tone\""
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 본문 텍스트 - displayContent가 있을 때만 표시 */}
      {displayContent && (
        <div className="prose prose-sm max-w-none">
          {isInquiryPage ? (
            // "문의/제안" 페이지는 특별한 렌더링
            <div className="flex flex-col gap-3">
              {displayContent.split("\n").map((line: string, index: number) => (
                <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                · {t("유튜브")}: <a
                  href="https://www.youtube.com/@sndhandpanofficial2990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition-colors underline"
                >
                  https://www.youtube.com/@sndhandpanofficial2990
                </a>
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                · {t("인스타")}: <a
                  href="https://www.instagram.com/snd_handpan_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#14B8A6] transition-colors underline"
                >
                  https://www.instagram.com/snd_handpan_official/
                </a>
              </p>
            </div>
          ) : (
            // 일반 페이지는 기존 방식 유지
            displayContent.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))
          )}
        </div>
      )}

      {!displayContent && !isStainlessPage && (
        <p className="text-gray-500 dark:text-gray-400">{t("내용이 준비되지 않았습니다.")}</p>
      )}
    </div>
  );
}
