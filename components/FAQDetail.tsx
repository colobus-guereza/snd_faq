"use client";

import Link from "next/link";
import { FAQ } from "@/types/faq";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import InquiryForm from "@/components/InquiryForm";

interface FAQDetailProps {
  faq: FAQ;
  returnCategory?: string;
}

export default function FAQDetail({ faq, returnCategory }: FAQDetailProps) {
  const { language, t, getFAQ } = useLanguage();
  const backHref = returnCategory 
    ? `/?category=${encodeURIComponent(returnCategory)}`
    : "/";
  
  // "문의" 카테고리 질문(id: "7")은 뒤로가기 버튼 숨김
  const isInquiryPage = faq.id === "7";
  
  // "1.2mm 스테인레스를 사용하는 이유" 질문(id: "14")은 도표 표시
  const isStainlessPage = faq.id === "14";
  
  // 영어일 경우 번역된 FAQ 데이터 사용
  const translatedFAQ = getFAQ(faq.id);
  
  // "문의" 카테고리 질문은 타이틀 변경
  const displayTitle = isInquiryPage 
    ? t("문의")
    : (translatedFAQ ? translatedFAQ.title : faq.title);
  
  // 번역된 내용 사용
  const displayContent = translatedFAQ ? translatedFAQ.content : faq.content;
  const displayTags = translatedFAQ ? translatedFAQ.tags : faq.tags;
  
  // URL 복사 상태 관리
  const [copied, setCopied] = useState(false);
  
  // 차트 상세 내용 접기/펼치기 상태 관리
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  
  // URL을 링크로 변환하는 함수
  const convertUrlsToLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#14B8A6] transition-colors underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

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
          {/* 요약문 - 일반 소비자용 설명 */}
          <div className="mb-6">
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {language === "ko" 
                ? "핸드팬의 쉘 두께는 악기의 '뼈대'와 같습니다. 두꺼울수록 더 단단하고 견고해지지만, 동시에 더 무거워집니다."
                : "The shell thickness of a handpan is like the 'skeleton' of the instrument. The thicker it is, the sturdier and more robust it becomes, but also heavier."
              }
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {language === "ko"
                ? "1.2mm 쉘은 더 두꺼운 구조로 인해 음향·기능적 성능에서도 차이를 보입니다. 음정 안정성이 약 58% 향상되어 온도나 타격 변화에도 음정이 덜 흔들리며, 소리가 더 선명하고 집중된 공진 특성을 보입니다. 강한 타격에도 형태 변형이 적어 왜곡 저항이 약 44% 향상되지만, 반면 가볍게 울리는 구동 용이성은 약 17% 낮아집니다. 요약하면 정확도·내구성·집중감이 필요한 연주에 유리한 \"프로페셔널 톤\" 성향입니다."
                : "The 1.2mm shell, due to its thicker structure, shows differences in acoustic and functional performance. Pitch stability improves by approximately 58%, making the pitch less affected by temperature or impact changes, and the sound shows clearer and more focused resonance characteristics. Distortion resistance improves by approximately 44% with less deformation even under strong impacts, but ease of driving (resonating with light touch) decreases by approximately 17%. In summary, it favors a \"Professional Tone\" suitable for performances requiring accuracy, durability, and concentration."
              }
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {language === "ko"
                ? "반면 1.0mm 쉘은 가볍게 잘 울리는 편이라 작은 힘으로도 반응이 빠릅니다. 다만 두께가 얇아 강한 타격이나 외부 변화에 형상·피치가 상대적으로 민감합니다."
                : "On the other hand, the 1.0mm shell resonates easily and responds quickly even to small force. However, its thinner thickness makes it relatively sensitive to strong impacts or external changes in shape and pitch."
              }
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {language === "ko"
                ? "아래 도표는 1.0mm와 1.2mm 쉘의 구조적 특성을 비교한 것으로, 두께 차이에 따라 악기의 강도, 안정성, 반응성 등이 어떻게 달라지는지 보여줍니다."
                : "The chart below compares the structural properties of 1.0mm and 1.2mm shells, showing how strength, stability, and responsiveness differ based on thickness."
              }
            </p>
          </div>

          {/* 자세히보기 버튼 */}
          <button
            onClick={() => setIsDetailExpanded(!isDetailExpanded)}
            className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
          >
            <span>{isDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isDetailExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* 차트 및 상세 내용 - 접기/펼치기 */}
          {isDetailExpanded && (
            <div className="mt-6">
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
                <div className="flex justify-center mb-4">
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 rounded" style={{ borderColor: 'rgb(59, 130, 246)', backgroundColor: 'transparent', opacity: 0.7 }}></div>
                      <span className="text-gray-700 dark:text-gray-300">1.0 mm</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 rounded" style={{ borderColor: 'rgb(249, 115, 22)', backgroundColor: 'transparent' }}></div>
                      <span className="text-gray-700 dark:text-gray-300">1.2 mm</span>
                    </div>
                  </div>
                </div>

                {/* 레이더 차트 영역 */}
                <div className="flex justify-center items-center py-6">
                  <div className="relative" style={{ width: '500px', height: '500px' }}>
                    <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-full">
                      {/* 레이더 차트 데이터 */}
                      {(() => {
                        const centerX = 250;
                        const centerY = 250;
                        const maxRadius = 200;
                        const maxValue = 1.8;
                        const numAxes = 6;
                        const angleStep = (2 * Math.PI) / numAxes;
                        
                        // 데이터 정의
                        const data1_0mm = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0]; // 1.0mm 기준값
                        const data1_2mm = [1.73, 1.2, 1.2, 1.44, 1.44, 1.2]; // 1.2mm 값
                        
                        // 라벨 배열
                        const labels = [
                          language === "ko" ? "굽힘강성 D" : "Bending Stiffness D",
                          language === "ko" ? "면밀도 ρA" : "Area Density ρA",
                          language === "ko" ? "막(인장)강성" : "Membrane Stiffness",
                          language === "ko" ? "항복 모멘트" : "Yield Moment",
                          language === "ko" ? "좌굴 임계하중" : "Buckling Load",
                          language === "ko" ? "고유진동수 ƒ" : "Natural Freq. ƒ"
                        ];
                        
                        // 좌표 계산 함수
                        const getPoint = (index: number, value: number) => {
                          const angle = (index * angleStep) - (Math.PI / 2); // 시작을 위쪽으로
                          const radius = (value / maxValue) * maxRadius;
                          const x = centerX + radius * Math.cos(angle);
                          const y = centerY + radius * Math.sin(angle);
                          return { x, y };
                        };
                        
                        // 폴리곤 경로 생성 함수
                        const createPolygonPath = (data: number[]) => {
                          const points = data.map((value, index) => getPoint(index, value));
                          return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                        };
                        
                        return (
                          <>
                            {/* 그리드 라인 (동심원) */}
                            {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((value) => {
                              const radius = (value / maxValue) * maxRadius;
                              return (
                                <g key={value}>
                                  <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeDasharray="4,4"
                                    className="text-gray-300 dark:text-gray-700"
                                  />
                                  {/* 각 원 위에 숫자 표시 (12시 방향) */}
                                  <text
                                    x={centerX}
                                    y={centerY - radius - 8}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-[9px] fill-gray-600 dark:fill-gray-400"
                                  >
                                    {value.toFixed(1)}
                                  </text>
                                </g>
                              );
                            })}
                            
                            {/* 축 라인 */}
                            {Array.from({ length: numAxes }).map((_, index) => {
                              const angle = (index * angleStep) - (Math.PI / 2);
                              const endX = centerX + maxRadius * Math.cos(angle);
                              const endY = centerY + maxRadius * Math.sin(angle);
                              return (
                                <line
                                  key={index}
                                  x1={centerX}
                                  y1={centerY}
                                  x2={endX}
                                  y2={endY}
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  className="text-gray-300 dark:text-gray-700"
                                />
                              );
                            })}
                            
                            {/* 1.0mm 폴리곤 (파란색, 테두리만) */}
                            <path
                              d={createPolygonPath(data1_0mm)}
                              fill="none"
                              stroke="rgb(59, 130, 246)"
                              strokeWidth="2"
                              strokeOpacity="0.7"
                            />
                            
                            {/* 1.2mm 폴리곤 (주황색, 테두리만) */}
                            <path
                              d={createPolygonPath(data1_2mm)}
                              fill="none"
                              stroke="rgb(249, 115, 22)"
                              strokeWidth="2"
                              strokeOpacity="1"
                            />
                            
                            {/* 라벨 배치 */}
                            {labels.map((label, index) => {
                              const angle = (index * angleStep) - (Math.PI / 2);
                              const labelRadius = maxRadius + 30;
                              const x = centerX + labelRadius * Math.cos(angle);
                              const y = centerY + labelRadius * Math.sin(angle);
                              return (
                                <text
                                  key={index}
                                  x={x}
                                  y={y}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-[10px] fill-gray-700 dark:fill-gray-300"
                                >
                                  {label}
                                </text>
                              );
                            })}
                          </>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* 수식 및 해석 */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "굽힘강성 D:" : "Bending Stiffness D:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      D = Eh³ / 12(1 - ν²)
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "쉘의 휘어짐 저항. 두께 세제곱에 비례." : "Shell's bending resistance. Proportional to the cube of thickness."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "면밀도 ρA:" : "Area Density ρA:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      ρA = ρh
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "단위면적당 질량. 두께 1차 비례." : "Mass per unit area. Directly proportional to thickness."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "막(인장)강성:" : "Membrane (Tensile) Stiffness:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      ~ Eh
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "스피닝·튜닝 시 펴짐/늘어짐 저항. 얇을수록 늘어남 큼." : "Resistance to stretching/elongation during spinning/tuning. Greater elongation with thinner material."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "항복 모멘트:" : "Yield Moment:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      ~ σy h²
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "충격·국부 눌림에 대한 내성 증가." : "Increased resistance to impact and local indentation."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "좌굴 임계하중:" : "Buckling Critical Load:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      ∝ h²
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "압축·잔류응력에서 형상 안정성." : "Shape stability under compression and residual stress."}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {language === "ko" ? "고유진동수 ƒ:" : "Natural Frequency ƒ:"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-[10px] mb-2">
                      ƒ ∝ h
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 italic">
                      {language === "ko" ? "같은 지름·경계조건이면 전반적 모드 주파수 상승." : "Overall mode frequency increase with same diameter and boundary conditions."}
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
                        ? "1.2 mm 쉘은 1.0 mm 대비 전반적으로 '견고하고 안정적인 구조·기계적 특성'을 보인다."
                        : "The 1.2 mm shell generally shows 'robust and stable structural·mechanical properties' compared to the 1.0 mm shell."
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
                          {language === "ko" ? "굽힘강성 +73%:" : "Bending Stiffness +73%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "두께 세제곱에 비례하여 굽힘 저항이 크게 증가하여 쉘의 구조적 안정성이 향상된다."
                            : "Proportional to the cube of thickness, bending resistance significantly increases, improving the shell's structural stability."
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                          {language === "ko" ? "면밀도 +20%:" : "Area Density +20%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "단위면적당 질량이 증가하여 두께에 직접 비례하는 특성을 보인다."
                            : "Mass per unit area increases, showing characteristics directly proportional to thickness."
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                          {language === "ko" ? "막(인장)강성 +20%:" : "Membrane (Tensile) Stiffness +20%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "스피닝·튜닝 시 펴짐/늘어짐 저항이 증가하여 형상 유지 능력이 향상된다."
                            : "Resistance to stretching/elongation during spinning/tuning increases, improving shape retention capability."
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                          {language === "ko" ? "항복 모멘트 +44%:" : "Yield Moment +44%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "충격·국부 눌림에 대한 내성이 증가하여 강한 타격에도 형태 변형이 적다."
                            : "Increased resistance to impact and local indentation results in less deformation even with strong impacts."
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                          {language === "ko" ? "좌굴 임계하중 +44%:" : "Buckling Critical Load +44%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "압축·잔류응력에서 형상 안정성이 향상되어 좌굴·찌그러짐 내성이 증가한다."
                            : "Shape stability under compression and residual stress improves, increasing buckling/dent resistance."
                          }
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                          {language === "ko" ? "고유진동수 +20%:" : "Natural Frequency +20%:"}
                        </span>
                        <span>
                          {language === "ko" 
                            ? "같은 지름·경계조건이면 전반적 모드 주파수가 상승하여 공진 특성이 향상된다."
                            : "With the same diameter and boundary conditions, overall mode frequency increases, improving resonance characteristics."
                          }
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
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
                    <div className="w-3 h-3 border-2 rounded" style={{ borderColor: 'rgb(59, 130, 246)', backgroundColor: 'transparent', opacity: 0.7 }}></div>
                    <span className="text-gray-700 dark:text-gray-300">1.0 mm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 border-2 rounded" style={{ borderColor: 'rgb(249, 115, 22)', backgroundColor: 'transparent' }}></div>
                    <span className="text-gray-700 dark:text-gray-300">1.2 mm</span>
                  </div>
                </div>
              </div>

              {/* 레이더 차트 영역 */}
              <div className="flex justify-center items-center py-6">
                <div className="relative" style={{ width: '500px', height: '500px' }}>
                  <svg width="500" height="500" viewBox="0 0 500 500" className="w-full h-full">
                    {/* 레이더 차트 데이터 */}
                    {(() => {
                      const centerX = 250;
                      const centerY = 250;
                      const maxRadius = 200;
                      const maxValue = 1.8;
                      const numAxes = 4; // 4각형 레이더 차트 (4개 파라미터)
                      const angleStep = (2 * Math.PI) / numAxes;
                      
                      // 데이터 정의
                      const data1_0mm = [1.0, 1.0, 1.0, 1.0]; // 1.0mm 기준값
                      const data1_2mm = [1.58, 1.2, 0.83, 1.44]; // 1.2mm 값
                      
                      // 라벨 배열
                      const labels = [
                        language === "ko" ? "피치 안정성" : "Pitch Stability",
                        language === "ko" ? "공진 특성" : "Resonance",
                        language === "ko" ? "구동 용이성" : "Ease of Driving",
                        language === "ko" ? "왜곡 저항" : "Distortion Resistance"
                      ];
                      
                      // 좌표 계산 함수
                      const getPoint = (index: number, value: number) => {
                        const angle = (index * angleStep) - (Math.PI / 2); // 시작을 위쪽으로
                        const radius = (value / maxValue) * maxRadius;
                        const x = centerX + radius * Math.cos(angle);
                        const y = centerY + radius * Math.sin(angle);
                        return { x, y };
                      };
                      
                      // 폴리곤 경로 생성 함수
                      const createPolygonPath = (data: number[]) => {
                        const points = data.map((value, index) => getPoint(index, value));
                        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                      };
                      
                      return (
                        <>
                          {/* 그리드 라인 (동심원) */}
                          {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8].map((value) => {
                            const radius = (value / maxValue) * maxRadius;
                            return (
                              <g key={value}>
                                <circle
                                  cx={centerX}
                                  cy={centerY}
                                  r={radius}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  strokeDasharray="4,4"
                                  className="text-gray-300 dark:text-gray-700"
                                />
                                {/* 각 원 위에 숫자 표시 (12시 방향) */}
                                <text
                                  x={centerX}
                                  y={centerY - radius - 8}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-[9px] fill-gray-600 dark:fill-gray-400"
                                >
                                  {value.toFixed(1)}
                                </text>
                              </g>
                            );
                          })}
                          
                          {/* 축 라인 */}
                          {Array.from({ length: numAxes }).map((_, index) => {
                            const angle = (index * angleStep) - (Math.PI / 2);
                            const endX = centerX + maxRadius * Math.cos(angle);
                            const endY = centerY + maxRadius * Math.sin(angle);
                            return (
                              <line
                                key={index}
                                x1={centerX}
                                y1={centerY}
                                x2={endX}
                                y2={endY}
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-gray-300 dark:text-gray-700"
                              />
                            );
                          })}
                          
                          {/* 1.0mm 폴리곤 (파란색, 테두리만) */}
                          <path
                            d={createPolygonPath(data1_0mm)}
                            fill="none"
                            stroke="rgb(59, 130, 246)"
                            strokeWidth="2"
                            strokeOpacity="0.7"
                          />
                          
                          {/* 1.2mm 폴리곤 (주황색, 테두리만) */}
                          <path
                            d={createPolygonPath(data1_2mm)}
                            fill="none"
                            stroke="rgb(249, 115, 22)"
                            strokeWidth="2"
                            strokeOpacity="1"
                          />
                          
                          {/* 라벨 배치 */}
                          {labels.map((label, index) => {
                            const angle = (index * angleStep) - (Math.PI / 2);
                            const labelRadius = maxRadius + 30;
                            const x = centerX + labelRadius * Math.cos(angle);
                            const y = centerY + labelRadius * Math.sin(angle);
                            return (
                              <text
                                key={index}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] fill-gray-700 dark:fill-gray-300"
                              >
                                {label}
                              </text>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
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
        </div>
      )}

      {/* 본문 텍스트 - displayContent가 있을 때만 표시 */}
      {displayContent && (
        <div className="prose prose-sm max-w-none">
          {isInquiryPage ? (
            // "문의" 페이지는 특별한 렌더링
            <div className="flex flex-col gap-3">
              {displayContent.split("\n").map((line: string, index: number) => (
                <p key={index} className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              ))}
              {/* 소셜 미디어 아이콘 */}
              <div className="flex items-center gap-4 mt-2">
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
          ) : (
            // 일반 페이지는 기존 방식 유지
            displayContent.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {convertUrlsToLinks(paragraph)}
              </p>
            ))
          )}
        </div>
      )}

      {/* 문의 페이지에 문의 폼 추가 */}
      {isInquiryPage && <InquiryForm recipientEmail="handpansnd@gmail.com" />}

      {!displayContent && !isStainlessPage && (
        <p className="text-gray-500 dark:text-gray-400">{t("내용이 준비되지 않았습니다.")}</p>
      )}
    </div>
  );
}
