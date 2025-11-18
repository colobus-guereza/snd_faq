"use client";

import Link from "next/link";
import Image from "next/image";
import { FAQ } from "@/types/faq";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import AcousticMaturityChart from "./AcousticMaturityChart";
import TonefieldTensionDiagram, { ANIMATION_FRAME_PARAMS } from "./TonefieldTensionDiagram";
import Harmonics123Plot from "./Harmonics123Plot";
import OctaveResonancePlot from "./OctaveResonancePlot";
import C4C5G6ResonancePlot from "./C4C5G6ResonancePlot";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FAQDetailProps {
  faq: FAQ;
  returnCategory?: string;
}

export default function FAQDetail({ faq, returnCategory }: FAQDetailProps) {
  const { language, t, getFAQ } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 모바일 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";
  const backHref = returnCategory 
    ? `/?category=${encodeURIComponent(returnCategory)}`
    : "/";
  
  // "1.2mm 스테인레스를 사용하는 이유" 질문(id: "14")은 도표 표시
  const isStainlessPage = faq.id === "14";
  
  // "핸드팬 제작과정" 질문(id: "18")은 카드 형태로 표시
  const isManufacturingPage = faq.id === "18";
  
  // "DC04 VS 스테인레스" 질문(id: "17")은 카드 형태로 표시
  const isDC04Page = faq.id === "17";
  
  // "프레스 VS 메탈스피닝" 질문(id: "16")은 카드 형태로 표시
  const isPressSpinningPage = faq.id === "16";
  
  // "바텀 업그레이드" 질문(id: "41")은 카드 형태로 표시
  const isBottomUpgradePage = faq.id === "41";
  
  // "튜닝을 하면 소리가 더 좋아지는게 맞나요?" 질문(id: "32")은 그래프 표시
  const isTuningSoundPage = faq.id === "32";
  
  // 자세히보기/간단히보기 기능이 필요한 질문 ID 목록
  const expandableContentPages = ["3", "32", "34", "19", "20", "41"];
  const isExpandableContentPage = expandableContentPages.includes(faq.id);
  
  // 영어일 경우 번역된 FAQ 데이터 사용
  const translatedFAQ = getFAQ(faq.id);
  
  // 번역된 제목 사용
  const displayTitle = translatedFAQ ? translatedFAQ.title : faq.title;
  
  // 번역된 내용 사용
  const displayContent = translatedFAQ ? translatedFAQ.content : faq.content;
  const displayTags = translatedFAQ ? translatedFAQ.tags : faq.tags;
  
  // URL 복사 상태 관리
  const [copied, setCopied] = useState(false);
  
  // 차트 상세 내용 접기/펼치기 상태 관리
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  
  // 제작과정 카드 접기/펼치기 상태 관리
  const [isManufacturingExpanded, setIsManufacturingExpanded] = useState(false);
  
  // 리튠비용 계산서 접기/펼치기 상태 관리
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(false);
  
  // "튜닝을 하면 소리가 더 좋아지는게 맞나요?" 질문(id: "32")의 상세 내용 접기/펼치기 상태 관리
  const [isTuningDetailExpanded, setIsTuningDetailExpanded] = useState(false);
  
  // 자세히보기/간단히보기 기능이 있는 페이지의 상세 내용 접기/펼치기 상태 관리
  const [isContentDetailExpanded, setIsContentDetailExpanded] = useState(false);
  
  // 옥타브 공명 도표 표시 상태 관리
  const [showOctavePlot, setShowOctavePlot] = useState(false);
  const [showC4C5G6Plot, setShowC4C5G6Plot] = useState(false);
  
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
      return <span key={index}>{part}</span>;
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
      console.error(language === "ko" ? "URL 복사 실패:" : "Failed to copy URL:", err);
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

  // "튜닝 비용은 어떻게 책정되어 있나요?" 질문(id: "31")은 견적서 양식으로 표시
  const isTuningCostPage = faq.id === "31";
  
  // "하모닉스 피치 연주법" 질문(id: "35")은 YouTube 영상 표시
  const isHarmonicsPage = faq.id === "35";
  
  // "필수 훈련 리듬" 질문(id: "36")은 YouTube 재생목록 표시
  const isRhythmTrainingPage = faq.id === "36";
  
  // "딩 연주법" 질문(id: "37")은 YouTube 재생목록 표시
  const isBasicTechniquePage = faq.id === "37";
  
  // "스네어 연주법" 질문(id: "38")은 YouTube 재생목록 표시
  const isSnarePage = faq.id === "38";
  
  // "리듬 쪼개기" 질문(id: "39")은 YouTube 재생목록 표시
  const isRhythmBreakdownPage = faq.id === "39";
  
  // "마디 수 세기" 질문(id: "40")은 YouTube 재생목록 표시
  const isMeasureCountingPage = faq.id === "40";
  
  // "악기 표면이 벗겨져요." 질문(id: "4")은 카드 형태로 표시
  const isSurfacePeelingPage = faq.id === "4";
  
  // "외부충격에 의해 악기 표면이 움푹 파였어요." 질문(id: "33")은 카드 형태로 표시
  const isDentedSurfacePage = faq.id === "33";
  
  // "부딪치거나 떨어뜨려서 악기 옆면이 벌어졌어요." 질문(id: "11")은 카드 형태로 표시
  const isSideOpenedPage = faq.id === "11";
  
  // "톤필드를 두드려도 소리가 나지 않아요." 질문(id: "28")은 카드 형태로 표시
  const isNoSoundPage = faq.id === "28";
  
  // "배송 기간은 얼마나 걸리나요?" 질문(id: "2")은 카드 형태로 표시
  const isShippingPeriodPage = faq.id === "2";
  
  // "배송조회 방법이 궁금합니다." 질문(id: "9")은 카드 형태로 표시
  const isShippingTrackingPage = faq.id === "9";
  
  // "전자세금계산서나 현금영수증 발행되나요?" 질문(id: "8")은 카드 형태로 표시
  const isReceiptPage = faq.id === "8";
  
  // "악기 보관 방법이 궁금해요." 질문(id: "12")은 카드 형태로 표시
  const isStorageMethodPage = faq.id === "12";
  
  // "악기 관리 방법을 알려주세요." 질문(id: "5")은 카드 형태로 표시
  const isMaintenanceMethodPage = faq.id === "5";
  
  // "악기 소리가 처음과 달리 불안하고 답답하게 들려요." 질문(id: "3")은 카드 형태로 표시
  const isUnstableSoundPage = faq.id === "3";
  
  // "특정 저음을 두드릴 때 의도치 않은 고음 혹은 소음이 함께 들려요." 질문(id: "34")은 카드 형태로 표시
  const isLowNoteNoisePage = faq.id === "34";
  
  // "언제 리튠을 받으면 좋을까요?" 질문(id: "27")은 카드 2개 형태로 표시
  const isRetunePeriodPage = faq.id === "27";

  return (
    <div className="w-full">
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

      {displayTags && displayTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {displayTags.slice(0, 3).map((tag: string, index: number) => (
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
        <div className="mb-8">
          {/* 나머지 내용 - 카드 형태로 표시 */}
          <div className="space-y-6 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {language === "ko"
                  ? "1.2mm 쉘은 더 두꺼운 구조로 인해 음향·기능적 성능에서도 차이를 보입니다. 음정 안정성이 약 58% 향상되어 온도나 타격 변화에도 음정이 덜 흔들리며, 소리가 더 선명하고 집중된 공진 특성을 보입니다. 강한 타격에도 형태 변형이 적어 왜곡 저항이 약 44% 향상되지만, 반면 가볍게 울리는 구동 용이성은 약 17% 낮아집니다. 요약하면 정확도·내구성·집중감이 필요한 연주에 유리한 '프로페셔널 톤' 성향입니다."
                  : "The 1.2mm shell, due to its thicker structure, shows differences in acoustic and functional performance. Pitch stability improves by approximately 58%, making the pitch less affected by temperature or impact changes, and the sound shows clearer and more focused resonance characteristics. Distortion resistance improves by approximately 44% with less deformation even under strong impacts, but ease of driving (resonating with light touch) decreases by approximately 17%. In summary, it favors a \"Professional Tone\" suitable for performances requiring accuracy, durability, and concentration."
                }
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {language === "ko"
                  ? "반면 1.0mm 쉘은 가볍게 잘 울리는 편이라 작은 힘으로도 반응이 빠릅니다. 다만 두께가 얇아 강한 타격이나 외부 변화에 형상·피치가 상대적으로 민감합니다.\n\n아래 도표는 1.0mm와 1.2mm 쉘의 구조적 특성을 비교한 것으로, 두께 차이에 따라 악기의 강도, 안정성, 반응성 등이 어떻게 달라지는지 보여줍니다."
                  : "On the other hand, the 1.0mm shell resonates easily and responds quickly even to small force. However, its thinner thickness makes it relatively sensitive to strong impacts or external changes in shape and pitch.\n\nThe chart below compares the structural properties of 1.0mm and 1.2mm shells, showing how strength, stability, and responsiveness differ based on thickness."
                }
              </div>
            </div>
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
              {/* 차트 및 상세 내용 */}
              <div className="-mx-4 sm:-mx-0">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                {/* 차트 제목 */}
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {language === "ko" ? "쉘 구조·기계적 특성 비교 개념도" : "Conceptual Diagram for Shell Structure Mechanical Property Comparison"}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2 mb-4">
                    {language === "ko" ? "상대값 (1.0mm 기준)" : "Relative Value (Based on 1.0mm)"}
                  </p>
                  
                  {/* 참고 주석 */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800 mb-6 text-left">
                    <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === "ko" 
                        ? "※ 본 비교는 동일 재질 조건(ρ, E 불변)에서 두께 변화(1.0 mm → 1.2 mm)에 따른 상대적 구조·기계 특성 변화를 재료역학 이론식(D = Eh³/[12(1-v²)] 등)을 기준으로 추정한 개념도입니다. 실제 수치는 쉘 곡률·열처리·응력상태에 따라 달라질 수 있습니다."
                        : "※ This comparison is a conceptual diagram estimated based on material mechanics theoretical formulas (D = Eh³/[12(1-v²)], etc.) for relative structural and mechanical property changes due to thickness variation (1.0 mm → 1.2 mm) under identical material conditions (ρ, E constant). Actual values may vary depending on shell curvature, heat treatment, and stress state."}
                    </p>
                  </div>
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
                          language === "ko" ? "판 굽힘강성 D" : "Plate Bending Stiffness D",
                          language === "ko" ? "단위면적 질량 ρA" : "Areal Density ρA",
                          language === "ko" ? "막(인장)강성" : "Membrane Stiffness",
                          language === "ko" ? "항복 모멘트 용량 My" : "Yield Moment Capacity My",
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
                      {language === "ko" ? "판 굽힘강성 D:" : "Plate Bending Stiffness D:"}
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
                      {language === "ko" ? "단위면적 질량 ρA:" : "Areal Density ρA:"}
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
                      {language === "ko" ? "항복 모멘트 용량 My:" : "Yield Moment Capacity My:"}
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
                    {language === "ko" ? "쉘 두께에 따른 구조·음향 특성 비교 개념도" : "Conceptual Diagram for Comparing Structural and Acoustic Characteristics by Shell Thickness"}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-4">
                    {language === "ko" ? "상대값 (1.0mm 기준)" : "Relative Value (Based on 1.0mm)"}
                  </p>
                  
                  {/* 참고 주석 */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800 mb-6 text-left">
                <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {language === "ko" 
                    ? "※ 본 비교는 동일 재질 조건(탄성률 E, 밀도 ρ 불변)에서 두께 변화(1.0 → 1.2mm)에 따른 구조·기계·음향 특성을 재료역학 식(D ∝ Eh³, f ∝ √(D/ph))을 기준으로 추정한 개념도로, 실제 수치는 쉘 곡률, 응력 상태, 열처리 조건에 따라 달라질 수 있습니다."
                    : "※ This comparison is a conceptual diagram estimated based on material mechanics equations (D ∝ Eh³, f ∝ √(D/ph)) for structural, mechanical, and acoustic characteristics due to thickness change (1.0 → 1.2mm) under identical material conditions (elastic modulus E, density ρ constant). Actual values may vary depending on shell curvature, stress state, and heat treatment conditions."}
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
                        language === "ko" ? "좌굴/형상 변형 저항" : "Buckling/Shape Deformation Resistance"
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
                    {language === "ko" ? "좌굴/형상 변형 저항:" : "Buckling/Shape Deformation Resistance:"}
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
                      ? "1.2 mm 쉘은 1.0 mm 대비 전반적으로 더 강하고 안정적인 구조 특성을 보이며, 공진 주파수 안정성, 왜곡 저항, 음압 제어가 향상되고, 구동 반응성은 약간 감소하는 경향을 보입니다."
                      : "The 1.2 mm shell generally exhibits stronger and more stable structural characteristics compared to the 1.0 mm shell, with improved resonant frequency stability, distortion resistance, and sound pressure control, while driving responsiveness tends to decrease slightly."
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
                          ? "판 굽힘강성 증가로 외력/온도/습도 변화에도 주파수 변동이 작음"
                          : "Due to increased plate bending stiffness, frequency variation is small even with external forces/temperature/humidity changes"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "공진 특성 +20%:" : "Resonance Characteristics +20%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "공진 주파수 및 공진 품질(Q) 유지 향상"
                          : "Improved resonant frequency and resonance quality (Q) retention"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "좌굴/형상 변형 저항 +44%:" : "Buckling/Shape Deformation Resistance +44%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "항복 모멘트 증가로 형상 변형 및 잔류 변형 감소"
                          : "Reduced shape distortion and residual deformation due to increased yield moment"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[140px]">
                        {language === "ko" ? "구동 용이성 -17%:" : "Ease of Driving -17%:"}
                      </span>
                      <span>
                        {language === "ko" 
                          ? "질량 증가로 에너지 효율 약간 감소 및 반응 속도 둔화"
                          : "Slightly reduced energy efficiency and slowed response speed due to increased mass"}
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
                          ? "정확도·내구성·포커스 중심의 '프로페셔널 톤'"
                          : "Accuracy, durability, focus-centric \"Professional Tone\""
                        }
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[60px]">1.0 mm:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {language === "ko" 
                          ? "감응성·반응성 중심의 '익스프레시브 톤'"
                          : "Responsiveness, sensitivity-centric 'Expressive Tone'"
                        }
                      </span>
                    </div>
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

      {/* 제작과정 페이지 - 카드 형태로 표시 */}
      {isManufacturingPage && displayContent && (
        <div className="mb-8">
          {/* 제작과정 타임라인 그래프 - SVG 기반으로 재구성 */}
          {(() => {
            const steps = [
              { num: "1", title: language === "ko" ? "메탈스피닝" : "Metal Spinning", subtitle: language === "ko" ? "반구 쉘 제조" : "Shell" },
              { num: "2", title: language === "ko" ? "샌딩" : "Sanding", subtitle: language === "ko" ? "표면 준비" : "Surface" },
              { num: "3", title: language === "ko" ? "악기구조설계" : "Structure Design", subtitle: language === "ko" ? "자석 피킹" : "Magnet" },
              { num: "4", title: language === "ko" ? "프레싱" : "Pressing", subtitle: language === "ko" ? "30 ton" : "30 ton" },
              { num: "5", title: language === "ko" ? "열처리" : "Heat Treat", subtitle: language === "ko" ? "응력완화" : "Stress" },
              { num: "6", title: language === "ko" ? "쉘스트레칭" : "Stretching", subtitle: language === "ko" ? "해머링" : "Hammer" },
              { num: "7", title: language === "ko" ? "1차튜닝" : "1st Tuning", subtitle: language === "ko" ? "하모닉스" : "Harmonics" },
              { num: "8", title: language === "ko" ? "접착·건조" : "Adhesion", subtitle: language === "ko" ? "상하판 결합" : "Bonding" },
              { num: "9", title: language === "ko" ? "림가공" : "Rim Machining", subtitle: language === "ko" ? "가공" : "Process" },
              { num: "10", title: language === "ko" ? "2차튜닝" : "2nd Tuning", subtitle: language === "ko" ? "드리프트 보정" : "Drift" },
              { num: "11", title: language === "ko" ? "검수" : "Inspection", subtitle: language === "ko" ? "안정화" : "Stabilize" },
              { num: "12", title: language === "ko" ? "완성" : "Complete", subtitle: "" },
            ];
            
            // 그리드 좌표 정의 (px 단위)
            const boxWidth = 70;
            const boxHeight = 80;
            const hGap = 8;
            const vGap = 20;
            const rowHeight = boxHeight + vGap;
            
            // 각 단계의 그리드 위치 정의 (col, row)
            // 1행: 1, 2, 3
            // 2행: 4, 5, 6
            // 3행: 7, 8, 9
            // 4행: 10, 11, 12
            const gridPositions: Array<{ col: number; row: number }> = [
              { col: 0, row: 0 }, // 1
              { col: 1, row: 0 }, // 2
              { col: 2, row: 0 }, // 3
              { col: 0, row: 1 }, // 4
              { col: 1, row: 1 }, // 5
              { col: 2, row: 1 }, // 6
              { col: 0, row: 2 }, // 7
              { col: 1, row: 2 }, // 8
              { col: 2, row: 2 }, // 9
              { col: 0, row: 3 }, // 10
              { col: 1, row: 3 }, // 11
              { col: 2, row: 3 }, // 12
            ];
            
            // 상하 여백을 동일하게 설정
            const topPadding = 16; // 타이틀 아래 여백과 동일
            const bottomPadding = 16; // 마지막 줄 하단 여백
            
            // 각 단계의 실제 픽셀 좌표 계산
            const stepPositions = gridPositions.map((pos, index) => {
              const x = pos.col * (boxWidth + hGap) + boxWidth / 2;
              const y = pos.row * rowHeight + topPadding; // 상단 여백
              return { x, y, step: steps[index] };
            });
            
            // 화살표 경로 정의
            const arrows = [
              { from: 0, to: 1, type: 'horizontal' }, // 1 → 2
              { from: 1, to: 2, type: 'horizontal' }, // 2 → 3
              { from: 2, to: 3, type: 'vertical' },   // 3 → 4 (아래)
              { from: 3, to: 4, type: 'horizontal', reverse: true }, // 4 → 5 (왼쪽)
              { from: 4, to: 5, type: 'horizontal', reverse: true }, // 5 → 6 (왼쪽)
              { from: 5, to: 6, type: 'vertical' },   // 6 → 7 (아래)
              { from: 6, to: 7, type: 'horizontal' }, // 7 → 8
              { from: 7, to: 8, type: 'horizontal' }, // 8 → 9
              { from: 8, to: 9, type: 'L', direction: 'down-left' }, // 9 → 10 (L자: 아래 → 왼쪽)
              { from: 9, to: 10, type: 'horizontal', reverse: true }, // 10 → 11 (왼쪽)
            ];
            
            const svgWidth = 3 * boxWidth + 2 * hGap;
            // 마지막 행의 하단까지 + 하단 여백
            const svgHeight = 3 * rowHeight + boxHeight + bottomPadding;
            
            return (
              <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                  {language === "ko" ? "핸드팬 제작과정" : "Handpan Manufacturing Process"}
                </h3>
                <div className="relative" style={{ width: `${svgWidth}px`, height: `${svgHeight}px`, margin: '0 auto' }}>
                  {/* 단계 박스 레이어 */}
                  <div className="relative">
                    {stepPositions.map((pos, index) => (
                      <div
                        key={index}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${pos.x - boxWidth / 2}px`,
                          top: `${pos.y - topPadding}px`,
                          width: `${boxWidth}px`,
                        }}
                      >
                        <div className="w-9 h-9 rounded-full bg-[#14B8A6] dark:bg-[#0d9488] flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white dark:border-gray-900 mb-1.5">
                          {pos.step.num}
                        </div>
                        <div className="text-center px-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs leading-tight whitespace-nowrap">
                            {pos.step.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
          
          {/* 소개 문단 (카드가 아닌 일반 텍스트) - 첫 두 문단 표시 */}
          {displayContent.split("\n\n").slice(0, 2).map((paragraph: string, index: number) => {
            // 단계 제목(**숫자)로 시작하는 문단은 제외
            if (paragraph.match(/^\*\*\d+(?:-\d+)?\)/)) {
              return null;
            }
            return (
            <p key={index} className="mb-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {convertUrlsToLinks(paragraph)}
            </p>
            );
          })}
          
          {/* 자세히보기 버튼 */}
          <button
            onClick={() => setIsManufacturingExpanded(!isManufacturingExpanded)}
            className="mb-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
          >
            <span>{isManufacturingExpanded ? t("간단히보기") : t("자세히보기")}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isManufacturingExpanded ? 'rotate-180' : ''}`}
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
          
          {/* 단계별 카드 - 접기/펼치기 */}
          {isManufacturingExpanded && (
            <div className="grid grid-cols-1 gap-4">
              {(() => {
                // 단계별로 분리
                const paragraphs = displayContent.split("\n\n");
                const steps: Array<{ title: string; content: string }> = [];
                
                for (let i = 1; i < paragraphs.length; i++) {
                  const paragraph = paragraphs[i];
                  // "**숫자) 제목**" 패턴으로 시작하는 단계 찾기
                  const stepMatch = paragraph.match(/^\*\*(\d+(?:-\d+)?)\)\s*(.+?)\*\*$/);
                  if (stepMatch) {
                    const stepNumber = stepMatch[1];
                    const stepTitle = stepMatch[2];
                    // 다음 문단이 내용인지 확인
                    const nextParagraph = i + 1 < paragraphs.length ? paragraphs[i + 1] : "";
                    // 다음 문단이 또 다른 단계 제목이 아닌 경우 내용으로 간주
                    const isNextStep = nextParagraph.match(/^\*\*\d+(?:-\d+)?\)/);
                    if (!isNextStep && nextParagraph) {
                      steps.push({
                        title: `${stepNumber}) ${stepTitle}`,
                        content: nextParagraph.trim()
                      });
                      i++; // 다음 문단도 처리했으므로 인덱스 증가
                    } else {
                      // 내용이 없는 경우 빈 내용으로 추가
                      steps.push({
                        title: `${stepNumber}) ${stepTitle}`,
                        content: ""
                      });
                    }
                  } else {
                    // 서브 단계 (예: 2-1) 처리
                    const subStepMatch = paragraph.match(/^\*\*(\d+-\d+)\)\s*(.+?)\*\*$/);
                    if (subStepMatch && steps.length > 0) {
                      const stepNumber = subStepMatch[1];
                      const stepTitle = subStepMatch[2];
                      const nextParagraph = i + 1 < paragraphs.length ? paragraphs[i + 1] : "";
                      const isNextStep = nextParagraph.match(/^\*\*\d+(?:-\d+)?\)/);
                      if (!isNextStep && nextParagraph) {
                        // 이전 단계의 내용에 추가
                        steps[steps.length - 1].content += `\n\n**${stepNumber}) ${stepTitle}**\n\n${nextParagraph.trim()}`;
                        i++; // 다음 문단도 처리했으므로 인덱스 증가
                      } else {
                        steps[steps.length - 1].content += `\n\n**${stepNumber}) ${stepTitle}**`;
                      }
                    }
                  }
                }
                
                return steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {step.title}
                    </h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {convertUrlsToLinks(step.content)}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      )}

      {/* YouTube 영상 - 하모닉스 피치 연주법 페이지 */}
      {isHarmonicsPage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dp4vp_UuThA"
              title={language === "ko" ? "하모닉스 피치 연주법" : "Harmonics Playing Technique"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube 재생목록 - 필수 훈련 리듬 페이지 */}
      {isRhythmTrainingPage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/videoseries?list=PL4WnUbNHhe60m0lavGl2sKGMfrinGza-Q"
              title={language === "ko" ? "필수 훈련 리듬" : "Essential Training Rhythm"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube 재생목록 - 딩 연주법 페이지 */}
      {isBasicTechniquePage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/NLTcWrUORJM?list=PL4WnUbNHhe61QgyJ7JCQTfOwKwZrRkkQ8"
              title={language === "ko" ? "딩 연주법" : "Ding Playing Technique"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube 재생목록 - 스네어 연주법 페이지 */}
      {isSnarePage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/j_f2IviO6jY?list=PL4WnUbNHhe61QgyJ7JCQTfOwKwZrRkkQ8"
              title={language === "ko" ? "스네어 연주법" : "Snare Playing Technique"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube 재생목록 - 리듬 쪼개기 페이지 */}
      {isRhythmBreakdownPage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/Rzg86xliG88?list=PL4WnUbNHhe60m0lavGl2sKGMfrinGza-Q"
              title={language === "ko" ? "리듬 쪼개기" : "Rhythm Breakdown"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube 재생목록 - 마디 수 세기 페이지 */}
      {isMeasureCountingPage && (
        <div className="mb-6 w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 비율 */}
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/uUyyPxoMG64?list=PL4WnUbNHhe60m0lavGl2sKGMfrinGza-Q"
              title={language === "ko" ? "마디 수 세기" : "Counting Measures"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 악기 표면이 벗겨져요 페이지 - 카드 형태로 표시 */}
      {isSurfacePeelingPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 외부충격에 의해 악기 표면이 움푹 파였어요 페이지 - 카드 형태로 표시 */}
      {isDentedSurfacePage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 부딪치거나 떨어뜨려서 악기 옆면이 벌어졌어요 페이지 - 카드 형태로 표시 */}
      {isSideOpenedPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 톤필드를 두드려도 소리가 나지 않아요 페이지 - 카드 형태로 표시 */}
      {isNoSoundPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 배송 기간은 얼마나 걸리나요 페이지 - 카드 형태로 표시 */}
      {isShippingPeriodPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 배송조회 방법이 궁금합니다 페이지 - 카드 형태로 표시 */}
      {isShippingTrackingPage && displayContent && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
              {(() => {
                const paragraphs = displayContent.split("\n\n");
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const linkMatch = displayContent.match(urlRegex);
                const linkUrl = linkMatch ? linkMatch[0] : null;
                const textWithoutLink = paragraphs[0];
                
                return (
                  <>
                    <p className="whitespace-pre-line">{textWithoutLink}</p>
                    {linkUrl && (
                      <div className="pt-2">
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#14B8A6] hover:bg-[#0d9488] text-white text-sm sm:text-base font-medium rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>인터넷우체국 배송조회 페이지 바로가기</span>
                        </a>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 전자세금계산서나 현금영수증 발행되나요 페이지 - 카드 형태로 표시 */}
      {isReceiptPage && displayContent && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {convertUrlsToLinks(displayContent)}
            </div>
          </div>
        </div>
      )}

      {/* 악기 보관 방법이 궁금해요 페이지 - 카드 형태로 표시 */}
      {isStorageMethodPage && displayContent && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {convertUrlsToLinks(displayContent)}
            </div>
          </div>
        </div>
      )}

      {/* 악기 관리 방법을 알려주세요 페이지 - 카드 형태로 표시 */}
      {isMaintenanceMethodPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return paragraphs.map((paragraph: string, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(paragraph)}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* 악기 소리가 처음과 달리 불안하고 답답하게 들려요 페이지 - 첫 번째 문단만 카드 형태로 표시 */}
      {isUnstableSoundPage && displayContent && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {(() => {
                const paragraphs = displayContent.split("\n\n");
                return convertUrlsToLinks(paragraphs[0]);
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 특정 저음을 두드릴 때 의도치 않은 고음 혹은 소음이 함께 들려요 페이지 - 첫 번째 문단만 카드 형태로 표시 */}
      {isLowNoteNoisePage && displayContent && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {(() => {
                const paragraphs = displayContent.split("\n\n");
                return convertUrlsToLinks(paragraphs[0]);
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 튜닝을 하면 소리가 더 좋아지는게 맞나요 페이지 - 첫 번째 문단만 카드 형태로 표시 */}
      {isTuningSoundPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            return (
              <>
                {/* 첫 번째 문단 카드 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {convertUrlsToLinks(paragraphs[0])}
                  </div>
                </div>
                
                {/* 두 번째와 세 번째 문단 카드들 */}
                {paragraphs.slice(1, 3).map((paragraph: string, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {convertUrlsToLinks(paragraph)}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}

      {/* 언제 리튠을 받으면 좋을까요 페이지 - 카드 2개 형태로 표시 */}
      {isRetunePeriodPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            // 첫 번째 문단을 첫 번째 카드로 표시
            const firstCard = paragraphs[0];
            // 두 번째 카드에는 "권장 주기:"부터 항목들까지 포함 (paragraphs[1]부터 paragraphs[3]까지)
            const secondCard = paragraphs.slice(1, 4).join("\n\n");
            
            return [
              <div
                key={0}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {convertUrlsToLinks(firstCard)}
                </div>
              </div>,
              <div
                key={1}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {convertUrlsToLinks(secondCard)}
                </div>
              </div>
            ];
          })()}
        </div>
      )}

      {/* DC04 VS 스테인레스 페이지 - 카드 형태로 표시 */}
      {isDC04Page && displayContent && !isSurfacePeelingPage && !isDentedSurfacePage && !isSideOpenedPage && !isNoSoundPage && !isShippingPeriodPage && !isShippingTrackingPage && !isReceiptPage && !isStorageMethodPage && !isMaintenanceMethodPage && !isUnstableSoundPage && !isLowNoteNoisePage && !isTuningSoundPage && !isRetunePeriodPage && (
        <>
          {/* 본문 카드 형태로 표시 */}
          <div className="mb-8 space-y-6">
            {/* 서론 문단 */}
            {(() => {
              const paragraphs = displayContent.split("\n\n");
              const introParagraph = paragraphs[0];
              return (
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {convertUrlsToLinks(introParagraph)}
                </p>
              );
            })()}
            
            {/* 섹션별 카드 */}
            {(() => {
              const paragraphs = displayContent.split("\n\n");
              const sections: Array<{ title: string; content: string }> = [];
              
              for (let i = 1; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i];
                // "**① 제목**" 또는 "**② 제목**" 패턴으로 시작하는 섹션 찾기
                const sectionMatch = paragraph.match(/^\*\*([①②③])\s*(.+?)\*\*$/);
                if (sectionMatch) {
                  const sectionNumber = sectionMatch[1];
                  const sectionTitle = sectionMatch[2];
                  // 다음 문단이 내용인지 확인
                  const nextParagraph = i + 1 < paragraphs.length ? paragraphs[i + 1] : "";
                  // 다음 문단이 또 다른 섹션 제목이 아닌 경우 내용으로 간주
                  const isNextSection = nextParagraph.match(/^\*\*[①②③]/);
                  if (!isNextSection && nextParagraph) {
                    sections.push({
                      title: sectionTitle,
                      content: nextParagraph.trim()
                    });
                    i++; // 다음 문단도 처리했으므로 인덱스 증가
                  } else {
                    // 내용이 없는 경우 빈 내용으로 추가
                    sections.push({
                      title: sectionTitle,
                      content: ""
                    });
                  }
                }
              }
              
              return sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {section.title}
                  </h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {convertUrlsToLinks(section.content)}
                  </div>
                </div>
              ));
            })()}
          </div>
          
          {/* 자세히보기/간단히보기 영역 */}
          <div className="mt-6">
            <button
              onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
              className="flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
            >
              <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
            
            {/* 접기/펼치기 내용 */}
            {isContentDetailExpanded && (
              <div className="mt-6 space-y-6">
                {/* 소재 물성 비교 카드 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {language === "ko" ? "소재 물성 비교" : "Material Properties Comparison"}
                    </h4>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{language === "ko" ? "DC04 (저탄소 냉간압연강)" : "DC04 (Low Carbon Cold Rolled Steel)"}</p>
                      <p className="mb-2">{language === "ko" 
                        ? "탄성률 약 210 GPa, 0.2 % 기준 항복강도 140 ~ 210 MPa, 인장강도 270 ~ 370 MPa 수준입니다."
                        : "Elastic modulus approximately 210 GPa, 0.2% yield strength 140 ~ 210 MPa, tensile strength 270 ~ 370 MPa."}</p>
                      <p className="mb-2">{language === "ko" 
                        ? "심가공용 연강으로 성형성이 뛰어나지만, 무피막 재질이라 내식성이 낮고 산화·부식에 취약합니다."
                        : "Deep drawing steel with excellent formability, but as an uncoated material, it has low corrosion resistance and is vulnerable to oxidation and corrosion."}</p>
                      <p>{language === "ko" 
                        ? "가공 후 표면 마찰 특성이 쉽게 변하고, 산화로 인한 미세 거칠기 증가가 내부 손실과 접촉 손실을 유발해 장기 음향 품질에 부정적인 영향을 줍니다."
                        : "Surface friction characteristics change easily after processing, and increased micro roughness due to oxidation causes internal and contact losses, negatively affecting long-term acoustic quality."}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{language === "ko" ? "SUS430 (페라이트계 스테인리스강)" : "SUS430 (Ferritic Stainless Steel)"}</p>
                      <p className="mb-2">{language === "ko" 
                        ? "**Cr 16 ~ 18 %**의 수동피막으로 내식성이 우수합니다."
                        : "Excellent corrosion resistance due to passive film with **Cr 16 ~ 18 %**."}</p>
                      <p className="mb-2">{language === "ko" 
                        ? "탄성률 약 200 GPa, 0.2 % 기준 항복강도 ≥ 205 ~ 345 MPa, 인장강도 450 ~ 630 MPa로 초기 강도와 좌굴 내성이 높으며, 형상 안정성·응력 재분포 저항이 큽니다."
                        : "Elastic modulus approximately 200 GPa, 0.2% yield strength ≥ 205 ~ 345 MPa, tensile strength 450 ~ 630 MPa. High initial strength and buckling resistance, with strong resistance to shape stability and stress redistribution."}</p>
                      <p>{language === "ko" 
                        ? "따라서 장기 사용 시 표면 안정성과 공명 유지력이 DC04보다 우수합니다."
                        : "Therefore, surface stability and resonance maintenance are superior to DC04 during long-term use."}</p>
                    </div>
                    
                    {/* 소재 물성 비교 그래프 */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="w-full h-80 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                property: language === "ko" ? "탄성률" : "Elastic Modulus",
                                propertyUnit: language === "ko" ? "(GPa)" : "(GPa)",
                                DC04: 210,
                                SUS430: 200,
                              },
                              {
                                property: language === "ko" ? "항복강도" : "Yield Strength",
                                propertyUnit: language === "ko" ? "(MPa)" : "(MPa)",
                                DC04: 175, // 평균값 (140-210)
                                SUS430: 310, // 평균값 (275-345)
                              },
                              {
                                property: language === "ko" ? "인장강도" : "Tensile Strength",
                                propertyUnit: language === "ko" ? "(MPa)" : "(MPa)",
                                DC04: 340, // 평균값 (270-410)
                                SUS430: 525, // 평균값 (450-600)
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="property" 
                              angle={0}
                              textAnchor="middle"
                              height={100}
                              tick={(props: any) => {
                                const { x, y, payload } = props;
                                const dataIndex = payload.index;
                                const data = [
                                  {
                                    property: language === "ko" ? "탄성률" : "Elastic Modulus",
                                    propertyUnit: language === "ko" ? "(GPa)" : "(GPa)",
                                  },
                                  {
                                    property: language === "ko" ? "항복강도" : "Yield Strength",
                                    propertyUnit: language === "ko" ? "(MPa)" : "(MPa)",
                                  },
                                  {
                                    property: language === "ko" ? "인장강도" : "Tensile Strength",
                                    propertyUnit: language === "ko" ? "(MPa)" : "(MPa)",
                                  },
                                ];
                                const item = data[dataIndex];
                                return (
                                  <g transform={`translate(${x},${y})`}>
                                    <text
                                      x={0}
                                      y={8}
                                      textAnchor="middle"
                                      fill={resolvedTheme === 'dark' ? '#d1d5db' : '#374151'}
                                      fontSize={12}
                                    >
                                      {item.property}
                                    </text>
                                    <text
                                      x={0}
                                      y={22}
                                      textAnchor="middle"
                                      fill={resolvedTheme === 'dark' ? '#d1d5db' : '#374151'}
                                      fontSize={12}
                                    >
                                      {item.propertyUnit}
                                    </text>
                                  </g>
                                );
                              }}
                            />
                            <YAxis 
                              tick={{ fill: resolvedTheme === 'dark' ? '#d1d5db' : '#374151', fontSize: 12 }}
                              label={{ 
                                value: language === "ko" ? "수치" : "Value", 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fill: resolvedTheme === 'dark' ? '#d1d5db' : '#374151' }
                              }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                color: resolvedTheme === 'dark' ? '#d1d5db' : '#374151'
                              }}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                            />
                            <Bar dataKey="DC04" fill="#3b82f6" name="DC04" />
                            <Bar dataKey="SUS430" fill="#f97316" name="SUS430" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* 장기 음향 품질 영향 요인 비교 */}
                      <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                factor: language === "ko" ? "가공경화\n민감도" : "Work Hardening\nSensitivity",
                                DC04: 8, // 높음 (부정적)
                                SUS430: 3, // 낮음 (긍정적)
                                impact: language === "ko" ? "높을수록 부정적" : "Higher is negative",
                              },
                              {
                                factor: language === "ko" ? "내식성" : "Corrosion\nResistance",
                                DC04: 2, // 낮음 (부정적)
                                SUS430: 9, // 높음 (긍정적)
                                impact: language === "ko" ? "높을수록 긍정적" : "Higher is positive",
                              },
                              {
                                factor: language === "ko" ? "미세 거칠기\n안정성" : "Micro Roughness\nStability",
                                DC04: 3, // 불안정 (부정적)
                                SUS430: 9, // 안정적 (긍정적)
                                impact: language === "ko" ? "높을수록 긍정적" : "Higher is positive",
                              },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 120 : 80 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              dataKey="factor" 
                              angle={0}
                              textAnchor="middle"
                              height={isMobile ? 120 : 100}
                              tick={(props: any) => {
                                const { x, y, payload } = props;
                                const lines = payload.value.split('\n');
                                const fontSize = isMobile ? 10 : 12;
                                const lineHeight = isMobile ? 12 : 14;
                                return (
                                  <g transform={`translate(${x},${y})`}>
                                    {lines.map((line: string, index: number) => (
                                      <text
                                        key={index}
                                        x={0}
                                        y={index * lineHeight + 8}
                                        textAnchor="middle"
                                        fill={resolvedTheme === 'dark' ? '#d1d5db' : '#374151'}
                                        fontSize={fontSize}
                                      >
                                        {line}
                                      </text>
                                    ))}
                                  </g>
                                );
                              }}
                            />
                            <YAxis 
                              domain={[0, 10]}
                              tick={{ fill: resolvedTheme === 'dark' ? '#d1d5db' : '#374151', fontSize: 12 }}
                              label={{ 
                                value: language === "ko" ? "점수" : "Score", 
                                angle: -90, 
                                position: 'insideLeft',
                                style: { fill: resolvedTheme === 'dark' ? '#d1d5db' : '#374151' }
                              }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                color: resolvedTheme === 'dark' ? '#d1d5db' : '#374151'
                              }}
                              formatter={(value: number, name: string) => {
                                const labels: { [key: string]: string } = {
                                  DC04: language === "ko" ? "DC04" : "DC04",
                                  SUS430: language === "ko" ? "SUS430" : "SUS430",
                                };
                                return [`${value}/10`, labels[name] || name];
                              }}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                            />
                            <Bar dataKey="DC04" fill="#ef4444" name="DC04" />
                            <Bar dataKey="SUS430" fill="#10b981" name="SUS430" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* 참고 문구 */}
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">
                          {language === "ko" ? "참고" : "Note"}
                        </p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 list-disc list-inside">
                            <li>
                              {language === "ko" 
                                ? "가공경화 민감도는 높을수록 부정적이며, 내식성과 미세 거칠기 안정성은 높을수록 긍정적입니다."
                                : "Higher work hardening sensitivity is negative, while higher corrosion resistance and micro roughness stability are positive."}
                            </li>
                            <li>
                              {language === "ko" 
                                ? "위 도표들의 수치는 대표적 재료 물성값을 기반으로 한 평균 추정치입니다."
                                : "The values in the charts above are average estimates based on representative material property values."}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="mb-3"><strong className="font-semibold">{language === "ko" ? "비교 요약" : "Comparison Summary"}</strong></p>
                      <p className="mb-4">{language === "ko" 
                        ? "형상이 같다면 DC04는 탄성률이 약간 높아 초기 고유진동수에 유리할 수 있습니다. 그러나 SUS430은 산화로 인한 감쇠 증가를 억제하고 표면 상태를 안정적으로 유지하여, 공진 품질계수(큐, Q)를 장기간 안정적으로 유지하는 데 유리합니다."
                        : "If the shape is the same, DC04 may have an advantage in initial natural frequency due to slightly higher elastic modulus. However, SUS430 suppresses damping increase due to oxidation and maintains surface condition stably, which is advantageous for maintaining resonance quality factor (Q) stably over a long period."}</p>
                      <p className="mb-2"><strong className="font-semibold">{language === "ko" ? "두께 영향" : "Thickness Impact"}</strong></p>
                      <p>{language === "ko" 
                        ? "1.2밀리미터는 1.0밀리미터에 비해 굽힘 강성과 좌굴 저항이 의미 있게 증가합니다. 그 결과 피치 안정성과 디튠(급격한 음정 이탈) 내성이 향상되는 경향이 있습니다."
                        : "1.2mm shows a significant increase in bending stiffness and buckling resistance compared to 1.0mm. As a result, pitch stability and detune (sudden pitch deviation) resistance tend to improve."}</p>
                    </div>
                  </div>
                </div>

                {/* 완성악기 음향특성 비교 카드 */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {language === "ko" ? "완성악기 음향특성 비교" : "Completed Instrument Acoustic Characteristics Comparison"}
                    </h4>
                  </div>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{language === "ko" ? "DC04 핸드팬" : "DC04 Handpan"}</p>
                      <p>{language === "ko" 
                        ? "어택 즉응성이 높고 음색이 드라이하며, 서스테인은 중·단기로 형성되는 반면, 사용·환경 스트레스 축적 시 잔류응력 재배치와 표면 열화에 따라 위상정렬 불안 및 비팅 증가에 민감합니다."
                        : "High attack responsiveness and dry tone color, with sustain forming in medium to short term, while being sensitive to phase alignment instability and increased beating due to residual stress redistribution and surface degradation when usage and environmental stress accumulate."}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{language === "ko" ? "SUS430 핸드팬" : "SUS430 Handpan"}</p>
                      <p>{language === "ko" 
                        ? "서스테인이 길고 하모닉스 공명이 또렷하며, 장기 사용 시에도 피치 드리프트가 적어 조율 안정성이 우수합니다. 내식성과 표면 안정성 덕분에 위상정렬이 오래 유지되어 음색 품질이 일관됩니다."
                        : "Long sustain and clear harmonic resonance, with excellent tuning stability due to less pitch drift even during long-term use. Thanks to corrosion resistance and surface stability, phase alignment is maintained for a long time, ensuring consistent timbre quality."}</p>
                    </div>
                  </div>
                </div>
        </div>
            )}
          </div>
        </>
      )}

      {/* 프레스 VS 메탈스피닝 페이지 - 카드 2개 형태로 표시 */}
      {isPressSpinningPage && displayContent && (
        <div className="mb-8 space-y-6">
          {(() => {
            const paragraphs = displayContent.split("\n\n");
            const firstCardContent = paragraphs.slice(0, 2).join("\n\n"); // 1~2문단
            const secondCardContent = paragraphs.slice(2, 4).join("\n\n"); // 3~4문단
            
            return (
              <>
                {/* 첫 번째 카드: 1~2문단 */}
                {firstCardContent && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {convertUrlsToLinks(firstCardContent)}
                    </div>
                  </div>
                )}
                
                {/* 두 번째 카드: 3~4문단 */}
                {secondCardContent && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {convertUrlsToLinks(secondCardContent)}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* 바텀 업그레이드 페이지 (ID 41) - 별도 처리 */}
      {isBottomUpgradePage && (
        <div className="prose prose-sm max-w-none">
          <div className="space-y-6">
            {/* 제목 및 소개 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  바텀 업그레이드 안내
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  (Bottom Upgrade – 하단 베이스 노트 추가 서비스)
                </p>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p>
                  최근 유튜브 및 SNS에서 많이 접하시는 감성적인 핸드팬 연주는, 대부분 <strong className="font-semibold">하단 베이스 딩(Ding)</strong>이 추가된 악기를 기반으로 이루어집니다. 이러한 악기들은 상단의 기본 딩 1개에 더해 하단에 2개의 베이스 노트가 포함되어 있어, 하나의 악기 안에서 베이스라인–코드–멜로디를 동시에 표현할 수 있는 스토리텔링 기반의 현대적 연주 스타일이 가능합니다.
                </p>
                <p>
                  하지만 이미 9~10개 음 구성의 일반 악기를 사용 중이신 경우, 새로운 뮤턴트 악기를 새로 구매하는 것이 가격적으로 부담되거나, 현재 사용 중인 악기에 애정이 있어 계속 사용하고 싶으신 경우도 많습니다. 이러한 상황을 고려하여 SND Handpan에서는 현재 가지고 계신 일반 악기의 하단에 베이스 딩 2개를 추가하는 <strong className="font-semibold">'바텀 업그레이드(Bottom Upgrade)'</strong> 서비스를 제공하고 있습니다.
                </p>
              </div>
            </div>

            {/* 바텀 업그레이드가 특히 적합한 분들 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  바텀 업그레이드가 특히 적합한 분들
                </h3>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <ul className="list-none space-y-4 ml-0">
                  <li>
                    <strong className="font-semibold">• 9~10개 음 구성의 일반 악기를 사용 중이며,</strong>
                    <p className="mt-1 ml-4">현대적 감성 연주나 베이스 기반의 표현에서 한계를 느끼시는 분</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 400만 원 이상의 고가 뮤턴트 악기 구매는 부담되지만,</strong>
                    <p className="mt-1 ml-4">그에 준하는 베이스 표현력을 원하시는 분</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 뮤턴트 악기 또는 바텀 베이스 악기의 중고 구매 시</strong>
                    <p className="mt-1 ml-4">신뢰도·하자 여부·추가 튜닝 비용이 걱정되시는 분</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 현재 사용 중인 악기에 대한 애정과 익숙함을 유지한 채</strong>
                    <p className="mt-1 ml-4">연주 표현력을 확장하고 싶으신 분</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* 작업 방식 및 기술적 특징 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  작업 방식 및 기술적 특징
                </h3>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                <p>
                  바텀 업그레이드는 단순히 노트를 새로 뚫는 작업이 아니라, 새 악기를 제작하는 것에 준하는 고난도 공정을 포함합니다.
                </p>
                <ul className="list-none space-y-4 ml-0">
                  <li>
                    <strong className="font-semibold">• 상·하판 분리</strong>
                    <p className="mt-1 ml-4">이미 접착된 두 판을 손상 없이 분리하는 작업은 높은 기술을 요구합니다.</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 하판 베이스 노트 신규 제작 및 튜닝</strong>
                    <p className="mt-1 ml-4">하단에 두 개의 베이스 딩을 추가하고, 각각의 음정·진동모드·하모닉스 구조(1:2:3)를 정밀하게 튜닝합니다.</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 재접착 및 구조 복원</strong>
                    <p className="mt-1 ml-4">하판을 다시 결합한 후 악기 전체의 공명 구조가 안정적으로 유지되도록 정교한 정렬 작업이 필요합니다.</p>
                  </li>
                  <li>
                    <strong className="font-semibold">• 최종 전체 튜닝 및 전수 점검 포함</strong>
                    <p className="mt-1 ml-4">바텀 업그레이드 과정에는 별도로 진행할 경우 비용이 발생하는 <strong className="font-semibold">전체 음역대의 재점검·재튜닝(전수튜닝)</strong>이 추가 비용 없이 포함됩니다.</p>
                  </li>
                </ul>
                <p className="mt-4">
                  이 모든 과정은 새 악기 제작과 동일한 시간과 기술이 투입되는 공정입니다.
                </p>
              </div>
            </div>

            {/* 비용 안내 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  비용 안내
                </h3>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                <ul className="list-none space-y-2 ml-0">
                  <li>재접착 공정: <strong className="font-semibold">400,000원</strong></li>
                  <li>베이스 딩(노트) 추가: <strong className="font-semibold">300,000원 × 2개 = 600,000원</strong></li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    총 비용: <span className="text-[#14B8A6]">1,000,000원</span>
                  </p>
                </div>
                <p className="mt-4">
                  이는 새 뮤턴트 악기를 구매하거나, 이미 하판에 베이스 노트가 포함된 악기를 중고로 구매하는 것보다 가격 대비 효율이 높은 업그레이드 옵션입니다.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    * D5, E5처럼, 딩이 아닌 일반 사이즈 노트 추가도 가능하며, 비용은 <strong className="font-semibold">200,000원</strong>입니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 바텀 업그레이드의 장점 */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  바텀 업그레이드의 장점
                </h3>
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                <ul className="list-disc list-inside space-y-3 ml-4">
                  <li>현재 보유한 악기를 그대로 유지하면서 뮤턴트 연주 스타일 구현 가능</li>
                  <li>하단 베이스라인을 통해 현대적 감성·화성 기반 연주 가능</li>
                  <li>새 악기를 구매하는 것보다 경제적</li>
                  <li>업그레이드 과정에서 전체 검수·전수 튜닝 포함 → 악기 컨디션 개선 효과</li>
                  <li>개인이 아끼던 악기의 고유 음색·특성 유지</li>
                  <li>최근 트렌드(베이스 화성 기반 연주)에 적합하여 연주 폭이 크게 확장</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 본문 텍스트 - displayContent가 있을 때만 표시 (제작과정 페이지, DC04 페이지, 프레스 VS 메탈스피닝 페이지, 표면 벗겨짐 페이지, 외부충격 표면 움푹 파임 페이지, 톤필드 소리 안남 페이지, 옆면 벌어짐 페이지, 배송 기간 페이지, 배송조회 페이지, 전자세금계산서 페이지, 악기 보관 방법 페이지, 악기 관리 방법 페이지, 언제 리튠을 받으면 좋을까요 페이지, 바텀 업그레이드 페이지 제외) */}
      {displayContent && !isManufacturingPage && !isDC04Page && !isPressSpinningPage && !isSurfacePeelingPage && !isDentedSurfacePage && !isNoSoundPage && !isSideOpenedPage && !isShippingPeriodPage && !isShippingTrackingPage && !isReceiptPage && !isStorageMethodPage && !isMaintenanceMethodPage && !isRetunePeriodPage && !isBottomUpgradePage && (
        <div className="prose prose-sm max-w-none">
          {isTuningCostPage ? (
            // 튜닝 비용 페이지는 견적서 양식으로 표시
            <div className="space-y-6">
              {(() => {
                const paragraphs = displayContent.split("\n\n");
                const basicInfo = [];
                const exampleStartIndex = paragraphs.findIndex((p: string) => p.startsWith("ex)"));
                
                // 기본 정보 부분 (ex) 이전까지)
                for (let i = 0; i < exampleStartIndex; i++) {
                  basicInfo.push(paragraphs[i]);
                }
                
                // 기본 정보를 2개의 카드로 나눔
                // 첫 번째 카드: "개별노트 리튠비용" (bold) + 딩 사이즈 + 일반 사이즈 + "악기 전체리튠 진행 시" (basicInfo[0] + basicInfo[1] + basicInfo[2]의 첫 번째 줄)
                const firstCardTitle = basicInfo[0]; // "개별노트 리튠비용"
                const firstCardBody = basicInfo[1]; // 딩 사이즈 + 일반 사이즈
                const secondCardFull = basicInfo[2] || ""; // "· 악기 전체리튠 진행 시 25% 할인 적용\n· 리튠 택배접수 시, 왕복배송비 고객부담"
                const secondCardLines = secondCardFull.split("\n");
                const fullRetuneLine = secondCardLines[0] || ""; // "· 악기 전체리튠 진행 시 25% 할인 적용"
                const shippingLine = secondCardLines[1] || ""; // "· 리튠 택배접수 시, 왕복배송비 고객부담"
                
                return (
                  <>
                    {/* 기본 요금 정보 - 카드 2개 */}
                    <div className="mb-8 space-y-6">
                      {/* 첫 번째 카드 */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          <span className="font-bold">{firstCardTitle}</span>
                          {firstCardBody && `\n\n${firstCardBody}`}
                          {fullRetuneLine && `\n\n${fullRetuneLine}`}
                        </div>
                      </div>
                      
                      {/* 두 번째 카드 */}
                      {shippingLine.trim() && (
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                          <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {shippingLine}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 견적서 예시 */}
                    {exampleStartIndex !== -1 && (
                      <>
                        <button
                          onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
                          className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                        >
                          <span>
                            {isQuoteExpanded ? t("간단히보기") : (language === "ko" ? "견적서보기" : "View Quote")}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isQuoteExpanded ? 'rotate-180' : ''}`}
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
                        
                        {isQuoteExpanded && (
                          <div className="space-y-6">
                            {/* D Kurd 9 계산서 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                                  <thead>
                                    {/* 제목 행 - 헤더 스타일 */}
                                    <tr>
                                      <th colSpan={4} className="border border-gray-300 dark:border-gray-700 px-4 py-4 text-center text-lg font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "리튠비용 견적서" : "Retune Cost Quote"}
                                      </th>
                                    </tr>
                                    {/* 음계 정보 행들 - 2x2 그리드 (라벨: 회색, 데이터: 흰색) */}
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음계" : "Scale"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                                        D Kurd 9
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음 구성" : "Note Composition"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                                        D3 / A Bb C4 D E F G A
                                      </td>
                                    </tr>
                                    {/* 테이블 헤더 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "구분" : "Item"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "개수" : "Quantity"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "단가" : "Unit Price"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "합계" : "Total"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* 데이터 행들 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "딩 사이즈 노트 (D3)" : "Ding Size Note (D3)"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        1
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "50,000원" : "50,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "50,000원" : "50,000 KRW"}
                                      </td>
                                    </tr>
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "일반 사이즈 노트" : "Standard Size Notes"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        8
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "40,000원" : "40,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "320,000원" : "320,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 소계 행 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "소계" : "Subtotal"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "370,000원" : "370,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 할인 행 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "전체리튠 할인 25%" : "Full Retune Discount 25%"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                                        {language === "ko" ? "-92,500원" : "-92,500 KRW"}
                                      </td>
                                    </tr>
                                    {/* 최종 금액 행 - 강조 스타일 (파란색) */}
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "최종 금액" : "Final Amount"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {language === "ko" ? "277,500원" : "277,500 KRW"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* D Kurd 10 계산서 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                                  <thead>
                                    {/* 제목 행 - 헤더 스타일 */}
                                    <tr>
                                      <th colSpan={4} className="border border-gray-300 dark:border-gray-700 px-4 py-4 text-center text-lg font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "리튠비용 견적서" : "Retune Cost Quote"}
                                      </th>
                                    </tr>
                                    {/* 음계 정보 행들 - 2x2 그리드 (라벨: 회색, 데이터: 흰색) */}
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음계" : "Scale"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                                        D Kurd 10
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음 구성" : "Note Composition"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                                        D3 / A Bb C4 D E F G A C5
                                      </td>
                                    </tr>
                                    {/* 테이블 헤더 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "구분" : "Item"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "개수" : "Quantity"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "단가" : "Unit Price"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "합계" : "Total"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* 데이터 행들 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "딩 사이즈 노트 (D3)" : "Ding Size Note (D3)"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        1
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "50,000원" : "50,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "50,000원" : "50,000 KRW"}
                                      </td>
                                    </tr>
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "일반 사이즈 노트" : "Standard Size Notes"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        9
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "40,000원" : "40,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "360,000원" : "360,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 소계 행 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "소계" : "Subtotal"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "410,000원" : "410,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 할인 행 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "전체리튠 할인 25%" : "Full Retune Discount 25%"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                                        {language === "ko" ? "-102,500원" : "-102,500 KRW"}
                                      </td>
                                    </tr>
                                    {/* 최종 금액 행 - 강조 스타일 (파란색) */}
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "최종 금액" : "Final Amount"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {language === "ko" ? "307,500원" : "307,500 KRW"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* D Kurd 12 계산서 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                                  <thead>
                                    {/* 제목 행 - 헤더 스타일 */}
                                    <tr>
                                      <th colSpan={4} className="border border-gray-300 dark:border-gray-700 px-4 py-4 text-center text-lg font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "리튠비용 견적서" : "Retune Cost Quote"}
                                      </th>
                                    </tr>
                                    {/* 음계 정보 행들 - 2x2 그리드 (라벨: 회색, 데이터: 흰색) */}
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음계" : "Scale"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                                        D Kurd 12
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                                        {language === "ko" ? "음 구성" : "Note Composition"}
                                      </td>
                                      <td colSpan={2} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900">
                                        D3 / (E F) A Bb C4 D E F G A C5
                                      </td>
                                    </tr>
                                    {/* 테이블 헤더 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "구분" : "Item"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "개수" : "Quantity"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "단가" : "Unit Price"}
                                      </th>
                                      <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "합계" : "Total"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* 데이터 행들 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "딩 사이즈 노트 (D3, E3, F3)" : "Ding Size Notes (D3, E3, F3)"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        3
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "50,000원" : "50,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "150,000원" : "150,000 KRW"}
                                      </td>
                                    </tr>
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "일반 사이즈 노트" : "Standard Size Notes"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
                                        9
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "40,000원" : "40,000 KRW"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "360,000원" : "360,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 소계 행 - 헤더 스타일 */}
                                    <tr className="bg-gray-50 dark:bg-gray-800">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "소계" : "Subtotal"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "510,000원" : "510,000 KRW"}
                                      </td>
                                    </tr>
                                    {/* 할인 행 - 데이터 스타일 (흰색) */}
                                    <tr className="bg-white dark:bg-gray-900">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {language === "ko" ? "전체리튠 할인 25%" : "Full Retune Discount 25%"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm text-red-600 dark:text-red-400 font-medium">
                                        {language === "ko" ? "-127,500원" : "-127,500 KRW"}
                                      </td>
                                    </tr>
                                    {/* 최종 금액 행 - 강조 스타일 (파란색) */}
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                      <td colSpan={3} className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {language === "ko" ? "최종 금액" : "Final Amount"}
                                      </td>
                                      <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {language === "ko" ? "382,500원" : "382,500 KRW"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          ) : faq.id === "6" ? (
            // 레슨 페이지는 카드 형태로 표시
            <div className="space-y-4">
              {(() => {
                const paragraphs = displayContent.split("\n\n");
                const cards = [];
                
                for (let i = 0; i < paragraphs.length; i++) {
                  const paragraph = paragraphs[i];
                  
                  // 1번 카드: 그룹수업
                  if (paragraph.startsWith("1.")) {
                    const content = paragraph.replace(/^1\.\s*/, "");
                    const title = content.trim();
                    // 다음 단락이 있고 "2."로 시작하지 않으면 본문으로 포함
                    const description = (i + 1 < paragraphs.length && !paragraphs[i + 1].startsWith("2."))
                      ? paragraphs[i + 1]
                      : "";
                    
                    cards.push(
                      <div key={`card-1`} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          {title}
                        </h3>
                        {description && (
                          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {description.split("\n").map((line: string, lineIndex: number) => {
                              // 언어에 관계없이 인스타그램 언급 체크 (한글: "저스트비 인스타그램", 영문: "Justbe Instagram")
                              const isInstagramLine = line.includes("저스트비 인스타그램") || line.includes("Justbe Instagram");
                              if (isInstagramLine) {
                                // 한글: "게시됩니다." 뒤에 아이콘
                                // 영문: "Justbe Instagram" 뒤에 아이콘
                                if (line.includes("저스트비 인스타그램")) {
                                  const parts = line.split("게시됩니다.");
                                  return (
                                    <p key={lineIndex} className="mb-2 inline-flex items-center gap-1">
                                      {parts[0]}게시됩니다.
                                      <a
                                        href="https://www.instagram.com/justbe_temple/"
                  target="_blank"
                  rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-80 transition-opacity"
                                        aria-label={language === "ko" ? "저스트비 인스타그램" : "Justbe Instagram"}
                                      >
                                        <svg
                                          className="w-3 h-3 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                      </a>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const phoneNumber = "010-5387-0152";
                                          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                            if (isMobile) {
                                              window.location.href = `tel:${phoneNumber}`;
                                            } else {
                                              navigator.clipboard.writeText(phoneNumber).then(() => {
                                                alert(language === "ko" ? `전화번호가 복사되었습니다: ${phoneNumber}` : `Phone number copied: ${phoneNumber}`);
                                              }).catch(() => {
                                                alert(language === "ko" ? `전화번호: ${phoneNumber}` : `Phone number: ${phoneNumber}`);
                                              });
                                            }
                                        }}
                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer"
                                        aria-label={language === "ko" ? "전화하기" : "Call"}
                                      >
                                        <svg
                                          className="w-3 h-3 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                        </svg>
                                      </button>
                                      {parts[1]}
                                    </p>
                                  );
                                } else {
                                  // 영문: "Justbe Instagram." 뒤에 아이콘 (마지막 '.' 기준)
                                  const lastDotIndex = line.lastIndexOf(".");
                                  if (lastDotIndex !== -1) {
                                    const beforeDot = line.substring(0, lastDotIndex + 1);
                                    const afterDot = line.substring(lastDotIndex + 1);
                                    return (
                                      <p key={lineIndex} className="mb-2 inline-flex items-center gap-1">
                                        {beforeDot}
                                        <a
                                          href="https://www.instagram.com/justbe_temple/"
                  target="_blank"
                  rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-80 transition-opacity"
                                          aria-label="Justbe Instagram"
                                        >
                                          <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                          </svg>
                                        </a>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            const phoneNumber = "010-5387-0152";
                                            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                            if (isMobile) {
                                              window.location.href = `tel:${phoneNumber}`;
                                            } else {
                                              navigator.clipboard.writeText(phoneNumber).then(() => {
                                                alert(language === "ko" ? `전화번호가 복사되었습니다: ${phoneNumber}` : `Phone number copied: ${phoneNumber}`);
                                              }).catch(() => {
                                                alert(language === "ko" ? `전화번호: ${phoneNumber}` : `Phone number: ${phoneNumber}`);
                                              });
                                            }
                                          }}
                                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer"
                                          aria-label={language === "ko" ? "전화하기" : "Call"}
                                        >
                                          <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                          </svg>
                                        </button>
                                        {afterDot}
                                      </p>
                                    );
                                  }
                                  // '.'이 없으면 그대로 반환
                                  return <p key={lineIndex} className="mb-2">{line}</p>;
                                }
                              }
                              return <p key={lineIndex} className="mb-2">{line}</p>;
                            })}
            </div>
                        )}
                      </div>
                    );
                    // 다음 단락을 본문으로 사용했으면 인덱스 건너뛰기
                    if (description) i++;
                  }
                  
                  // 2번 카드: 1:1 핸드팬 레슨
                  else if (paragraph.startsWith("2.")) {
                    const content = paragraph.replace(/^2\.\s*/, "");
                    const title = content.trim();
                    // 다음 단락들에서 선생님 정보 수집
                    const teachers: string[] = [];
                    for (let j = i + 1; j < paragraphs.length; j++) {
                      if (paragraphs[j].startsWith("·") || paragraphs[j].startsWith("-")) {
                        teachers.push(...paragraphs[j].split("\n").filter((line: string) => line.trim().startsWith("·") || line.trim().startsWith("-")));
                      } else if (paragraphs[j].startsWith("2.") || paragraphs[j].startsWith("1.")) {
                        break;
                      }
                    }
                    
                    // 선생님별 인스타그램 링크 매핑 (한글 이름 기준)
                    const teacherInstagramMap: { [key: string]: string } = {
                      "이지은": "https://www.instagram.com/warmwaves_therapy/",
                      "권민체": "https://www.instagram.com/mago__sound/",
                      "안재민": "https://www.instagram.com/handpan__jmin/",
                    };
                    
                    // 선생님별 전화번호 매핑 (한글 이름 기준)
                    const teacherPhoneMap: { [key: string]: string } = {
                      "이지은": "010-4529-9038",
                      "권민체": "010-4445-4689",
                      "안재민": "010-7229-7450",
                    };
                    
                    // 영문 이름을 한글 이름으로 매핑
                    const englishToKoreanNameMap: { [key: string]: string } = {
                      "Lee Ji-eun": "이지은",
                      "Kwon Min-che": "권민체",
                      "Ahn Jae-min": "안재민",
                    };
                    
                    cards.push(
                      <div key={`card-2`} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          {title}
                        </h3>
                        {teachers.length > 0 && (
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            {teachers.map((teacher: string, teacherIndex: number) => {
                              const trimmedTeacher = teacher.trim().replace(/^[·-]\s*/, "");
                              // 선생님 이름 추출
                              // 한글: "[서대문] 이지은 선생님" -> "이지은"
                              // 영문: "[Seodaemun] Teacher Lee Ji-eun" -> "Lee Ji-eun" -> "이지은"
                              let teacherName = "";
                              const koreanMatch = trimmedTeacher.match(/\[.*?\]\s*([가-힣]+)\s*선생님/);
                              const englishMatch = trimmedTeacher.match(/\[.*?\]\s*Teacher\s+([A-Z][a-z]+\s+[A-Z][a-z-]+)/);
                              
                              if (koreanMatch) {
                                teacherName = koreanMatch[1];
                              } else if (englishMatch) {
                                const englishName = englishMatch[1];
                                teacherName = englishToKoreanNameMap[englishName] || "";
                              }
                              
                              const instagramUrl = teacherName ? teacherInstagramMap[teacherName] : null;
                              const phoneNumber = teacherName ? teacherPhoneMap[teacherName] : null;
                              
                              return (
                                <React.Fragment key={teacherIndex}>
                                  <li className="leading-relaxed flex items-center gap-1">
                                    · {trimmedTeacher}
                                    {instagramUrl && (
                                      <>
                                        <a
                                          href={instagramUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-80 transition-opacity"
                                          aria-label={language === "en" ? `${teacherName} Instagram` : `${teacherName} 인스타그램`}
                                        >
                                          <svg
                                            className="w-3 h-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                          </svg>
                                        </a>
                                        {phoneNumber && (
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              // 모바일 기기 확인
                                              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                              if (isMobile) {
                                                window.location.href = `tel:${phoneNumber}`;
                                              } else {
                                                // 웹에서는 클립보드에 복사
                                                const message = language === "en" 
                                                  ? `Phone number copied: ${phoneNumber}`
                                                  : `전화번호가 복사되었습니다: ${phoneNumber}`;
                                                navigator.clipboard.writeText(phoneNumber).then(() => {
                                                  alert(message);
                                                }).catch(() => {
                                                  alert(language === "en" ? `Phone number: ${phoneNumber}` : `전화번호: ${phoneNumber}`);
                                                });
                                              }
                                            }}
                                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 hover:opacity-80 transition-opacity cursor-pointer"
                                            aria-label={language === "en" ? `Call ${teacherName}` : `${teacherName} 전화하기`}
                                          >
                                            <svg
                                              className="w-3 h-3 text-white"
                                              fill="currentColor"
                                              viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                            </svg>
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </li>
                                  {teacherName === "안재민" && (
                                    <li className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {language === "en" 
                                        ? "Each location has different curriculum and lesson fees, so we recommend consulting directly."
                                        : "지점마다 커리큘럼과 레슨비용이 다르기 때문에, 직접 상담 받아보시길 권해드립니다."}
                                    </li>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  }
                }
                
                return cards;
              })()}
            </div>
          ) : isTuningSoundPage ? (
            // 튜닝 소리 페이지는 그래프만 접기/펼치기
            (() => {
              return (
                <>
                  {/* 자세히보기 버튼 */}
                  <button
                    onClick={() => setIsTuningDetailExpanded(!isTuningDetailExpanded)}
                    className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                  >
                    <span>{isTuningDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isTuningDetailExpanded ? 'rotate-180' : ''}`}
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
                  
                  {/* 그래프만 접기/펼치기 */}
                  {isTuningDetailExpanded && (
                    <div className="mt-4">
                      <AcousticMaturityChart />
                    </div>
                  )}
                </>
              );
            })()
          ) : faq.id === "3" ? (
            // 기술지원문서 스타일로 렌더링
            (() => {
              const paragraphs = displayContent.split("\n\n");
              const firstParagraph = paragraphs[0];
              const remainingContent = paragraphs.slice(1).join("\n\n");
              
              // 기술지원문서 구조 파싱
              const parseTechnicalContent = (content: string) => {
                const sections: Array<{ type: string; title?: string; items?: Array<{ label: string; text: string }>; text?: string }> = [];
                const paragraphs = content.split("\n\n");
                let currentSection: any = null;
                
                for (const para of paragraphs) {
                  const trimmed = para.trim();
                  if (!trimmed) continue;
                  
                  // 메인 제목
                  if (trimmed.includes("세 가지가 주요 원인")) {
                    if (currentSection) sections.push(currentSection);
                    sections.push({ type: "title", text: trimmed });
                    currentSection = null;
                    continue;
                  }
                  
                  // 섹션 제목 (1), 2), 3))
                  if (/^\d+\)/.test(trimmed)) {
                    if (currentSection) sections.push(currentSection);
                    currentSection = { type: "section", title: trimmed, items: [] };
                    continue;
                  }
                  
                  // 용어 설명 섹션 제목
                  if (trimmed.includes("용어 설명") || trimmed.includes("Terminology")) {
                    if (currentSection) sections.push(currentSection);
                    sections.push({ type: "summary-title", text: trimmed });
                    currentSection = null;
                    continue;
                  }
                  
                  // 개념 정의 (피치 드리프트, 급성 피치 이탈)
                  if (/^피치 드리프트|^급성 피치 이탈|^Pitch Drift|^Acute Pitch Shift/.test(trimmed)) {
                    if (currentSection) sections.push(currentSection);
                    currentSection = { type: "concept", title: trimmed, items: [] };
                    continue;
                  }
                  
                  // 섹션 또는 개념의 항목 파싱
                  if (currentSection) {
                    const lines = trimmed.split("\n");
                    for (const line of lines) {
                      const lineTrimmed = line.trim();
                      if (!lineTrimmed) continue;
                      
                      // 항목 라벨 (개념, 증상, 특징, 조치, 정의, 가역성, 관측)
                      const labelMatch = lineTrimmed.match(/^([^:(]+)(\([^)]+\))?:\s*(.+)$/);
                      if (labelMatch) {
                        const label = labelMatch[1].trim();
                        const text = labelMatch[3].trim();
                        if (!currentSection.items) currentSection.items = [];
                        currentSection.items.push({ label, text });
                      } else {
                        // 라벨이 없는 경우 마지막 항목에 추가
                        if (currentSection.items && currentSection.items.length > 0) {
                          const lastItem = currentSection.items[currentSection.items.length - 1];
                          lastItem.text += " " + lineTrimmed;
                        } else {
                          // 첫 항목인 경우
                          if (!currentSection.items) currentSection.items = [];
                          currentSection.items.push({ label: "", text: lineTrimmed });
                        }
                      }
                    }
                  }
                }
                
                if (currentSection) sections.push(currentSection);
                
                return sections;
              };
              
              const sections = remainingContent ? parseTechnicalContent(remainingContent) : [];
              
              return (
                <>
                  {/* 자세히보기 버튼 */}
                  {sections.length > 0 && (
                    <button
                      onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
                      className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                    >
                      <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
                  )}
                  
                  {/* 상세 내용 - 접기/펼치기 (스테인레스 페이지와 동일한 스타일) */}
                  {isContentDetailExpanded && sections.length > 0 && (
                    <div className="mt-6 -mx-4 sm:-mx-0">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                        {sections.map((section, sectionIndex) => {
                          if (section.type === "title") {
                            return (
                              <p key={sectionIndex} className="mb-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed text-left">
                                {section.text}
                              </p>
                            );
                          }
                          
                          if (section.type === "section" && section.title) {
                            return (
                              <div key={sectionIndex} className="mb-8">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                  {section.title}
                                </h4>
                                {section.items && section.items.length > 0 && (
                                  <div className="space-y-3">
                                    {section.items.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="flex items-start gap-3">
                                        {item.label && (
                                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm min-w-[80px] flex-shrink-0">
                                            {item.label}:
                                          </div>
                                        )}
                                        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                                          {convertUrlsToLinks(item.text)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          if (section.type === "summary-title") {
                            return (
                              <div key={sectionIndex} className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600 mb-6">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                  {section.text}
                                </h3>
                              </div>
                            );
                          }
                          
                          if (section.type === "concept" && section.title) {
                            return (
                              <div key={sectionIndex} className="mb-8">
                                <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                  {section.title}
                                </h4>
                                {section.items && section.items.length > 0 && (
                                  <div className="space-y-3">
                                    {section.items.map((item: any, itemIndex: number) => (
                                      <div key={itemIndex} className="flex items-start gap-3">
                                        {item.label && (
                                          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm min-w-[80px] flex-shrink-0">
                                            {item.label}:
                                          </div>
                                        )}
                                        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                                          {convertUrlsToLinks(item.text)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()
          ) : faq.id === "34" ? (
            // id "34"는 첫 번째 문단은 카드로 표시되고, 나머지 내용은 자세히보기/간단히보기 영역에 표시
            <>
              {/* 자세히보기/간단히보기 영역 */}
              <div className="mt-6">
                <button
                  onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
                  className="flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                >
                  <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
                
                {/* 접기/펼치기 내용 */}
                {isContentDetailExpanded && (
                  <div className="mt-6 space-y-6">
                    {/* 현상 설명 카드 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          현상 설명 — '옥타브 공명'
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">이름</p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            옥타브 공명은 옥타브 관계의 노트가 동조 공명으로 함께 진동하는 현상입니다. 조율 정합이 정확할수록 더 뚜렷하게 나타납니다.
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">예시</p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            D Kurd 10에서 C4를 연주하실 때 옥타브인 C5가 공명할 수 있습니다. C5에는 2F₀(옥타브), 3F₀(복합5도: 한 옥타브 + 완전5도) 성분이 포함되어 있어, C4를 타격하셔도 귀에는 C5의 고역 성분 C6와 G6가 동반되어 들릴 수 있습니다. 이는 핸드팬의 본질인 하모닉스 정렬(1:2:3 비)이 잘 구현되었다는 정상 특성입니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 점검 방법 카드 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          간단한 점검 방법
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {/* 뮤트 테스트 */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">뮤트 테스트</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-7">
                            C5 톤필드를 손가락으로 가볍게 접촉(뮤트)하신 상태에서 C4를 연주해 보십시오. 고역 동반음이 사라지면 정상적인 옥타브 공명으로 보시면 됩니다.
                          </p>
                        </div>

                        {/* 다이내믹 테스트 */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">다이내믹 테스트</p>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-7">
                            같은 타격 위치·각도를 유지하시고 아주 작게 → 보통 → 세게로 볼륨을 단계적으로 높여 보십시오. 볼륨 변화에 따라 고역 동반음이 자연스럽게 증감하면 정상 범주로 판단하실 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 힌트 카드 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          힌트 — 다른 옥타브 공명도 들립니다
                        </h4>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          C4–C5 공명이 가장 두드러지지만, D3을 연주하실 때 D4가 공명하여 딩 D3의 댐핑감과 울림이 더 풍성하게 느껴지는 것도 동일한 옥타브 공명입니다. 악기와의 청감 학습이 진행되면, 처음에는 인지하지 못하셨던 다른 옥타브 쌍에서도 공명이 점차 또렷하게 들리실 수 있습니다. 이는 조율의 정확성을 나타내는 지표가 됩니다.
                        </p>
                      </div>
                    </div>

                    {/* 도표 해설 카드 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          왜 새 악기에서 더 도드라지게 들릴까요?
                        </h4>
                      </div>
                      <div className="space-y-6">
                        {/* 3. 이것이 정상인가요? */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            새 악기에서는 해머링 직후 톤필드의 장력이 가장 팽팽하고 모드(기본음·옥타브·복합5도)의 경계가 또렷하게 세팅되어 있어, 타격 순간 고주파 성분이 빠르게 응답하며 옥타브(2F₀) 모드가 더욱 선명하게 공명하는 경향이 있습니다. 사용이 누적되면 금속 내부의 미세 응력들이 완화되면서 장력 분포가 자연스럽게 안정화되고, 각 모드가 결에 맞춰 부드럽게 정렬되기 때문에 초기보다 옥타브 응답이 과하게 도드라져 들리는 느낌이 줄어들고 전체 음색이 한층 매끈하고 안정된 울림으로 자리 잡습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 도표 토글 버튼 카드 그리드 */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* C4-C5 옥타브 공명 개념도 토글 버튼 */}
                      <button
                        onClick={() => setShowOctavePlot(!showOctavePlot)}
                        className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all cursor-pointer text-left"
                      >
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                            C4-C5 옥타브 공명 개념도
                            {showOctavePlot && (
                              <span className="ml-2 text-sm text-[#14B8A6]">●</span>
                            )}
                          </h4>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center text-sm">
                            {showOctavePlot ? "도표 숨기기" : "도표 보기"}
                          </p>
                        </div>
                      </button>

                      {/* C4 연주 시 하모닉 동반 공명 토글 버튼 */}
                      <button
                        onClick={() => setShowC4C5G6Plot(!showC4C5G6Plot)}
                        className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all cursor-pointer text-left"
                      >
                        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
                            C4 연주 시 하모닉 동반 공명
                            {showC4C5G6Plot && (
                              <span className="ml-2 text-sm text-[#14B8A6]">●</span>
                            )}
                          </h4>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center text-sm">
                            {showC4C5G6Plot ? "도표 숨기기" : "도표 보기"}
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* 옥타브 공명 시각화 그래프 */}
                    {showOctavePlot && (
                      <div className="mb-6">
                        <OctaveResonancePlot />
                      </div>
                    )}

                    {/* C4-C5-G6 공명 그래프 */}
                    {showC4C5G6Plot && (
                      <div className="mb-6">
                        <C4C5G6ResonancePlot />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : faq.id === "21" ? (
            // id "21"는 구조화된 카드 형태로 표시
            <div className="space-y-6">
              {/* 1. 음계(Scale)는 무엇일까요? */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    1. 음계(Scale)는 무엇일까요?
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  음계는 음악의 색 팔레트와 같습니다. 한 옥타브라는 캔버스 위에 어울리는 색(음)을 골라 놓고, 그 색을 섞어 그림을 그리듯 멜로디를 만듭니다. 계단을 오르내리듯 규칙적인 간격으로 음이 배치되므로, 어떤 음계로 시작하느냐에 따라 곡의 분위기와 감정선이 달라집니다.
                </p>
              </div>

              {/* 2. 피아노 12음 vs. 핸드팬 5~8음의 선택 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    2. 피아노 12음 vs. 핸드팬 5~8음의 선택
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  피아노는 한 옥타브에 12개의 반음이 있어 모든 색을 다 담은 큰 색연필 상자와 비슷합니다. 핸드팬은 그중 5~8개 핵심 색만 골라 담은 맞춤 팔레트에 가깝습니다. 중앙의 딩(Ding)은 태양처럼 중심을 잡아 주고, 주변 톤필드는 행성처럼 그 주위를 돌며 조화로운 울림을 만듭니다. 색이 적으면 선이 간결하고 명상적이며, 색이 많으면 표현 범위와 이야기 전개가 넓어집니다.
                </p>
              </div>

              {/* 3. 음계가 만드는 분위기 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    3. 음계가 만드는 분위기
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  음계는 요리의 레시피와 같습니다.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 메이저(장조)</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">햇살 좋은 낮처럼 밝고 개방적입니다.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 마이너(단조)</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">해 질 녘처럼 서정적이고 사색적입니다.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 선법·민속계열</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">이국 향신료를 더한 맛처럼 독특한 색채와 긴장감을 줍니다.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 펜타토닉(5음)</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">재료가 단순한 만큼 누구나 맛있게 내기 쉬운 기본 레시피입니다.</p>
                  </div>
                </div>
              </div>

              {/* 4. 대중적 분류와 사용감 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    4. 대중적 분류와 사용감
                  </h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  일상에서 자주 쓰는 분류는 이렇습니다.
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 메이저/마이너</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">대중음악과 영화음악의 기본 뼈대. 안정적 진행.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 펜타토닉</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">즉흥 연주 친화적. 실수에 관대해 입문에 적합.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 도리안·프리지안·리디안 등 선법</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">개성 강한 색채와 공간감.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">· 하모닉/멜로딕 마이너 파생</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">중동·집시풍의 긴장과 해소를 선명히 부각.</p>
                  </div>
                </div>
              </div>

              {/* 5. 핸드팬 업계에서의 음계 사용 특징 */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    5. 핸드팬 업계에서의 음계 사용 특징
                  </h4>
                </div>
                <div className="space-y-4">
                  {/* 5-1 */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">5-1. 동일 스케일이라도 음 개수에 따른 뉘앙스와 가격</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      같은 음계 구조라도 <strong className="font-semibold">음 개수(9/12/14/18음 등)</strong>에 따라 보이싱 가능성, 보이스 리딩, 암시적 화성 정보량이 달라집니다.
                    </p>
                    <div className="space-y-2.5 mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 적은 음 개수:</strong> 모달 컬러가 선명하고 드론적. 즉흥·명상 적합.</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 많은 음 개수:</strong> 멜로딕 패턴과 패싱 음 운용 폭이 넓음.</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      음이 늘수록 레이아웃 설계와 튜닝 난이도, 공정 시간이 상승하여 프라이싱에 반영됩니다.
                    </p>
                  </div>

                  {/* 5-2 */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">5-2. 제작자별 네이밍 관행과 병행 표기</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      핸드팬 업계에는 제작자별 네이밍 컨벤션이 존재합니다. 동일한 간격 구조(스케일)라도 제작자·브랜드가 고유 철학과 레이아웃 차이를 반영해 자체 명칭을 부여합니다. 이 관행 때문에 같은 음계가 서로 다른 이름으로 병행 표기되는 현상이 발생합니다. 예를 들어, 음악 일반론의 D minor 계열은 D Kurd, D major 계열은 D Ashakiran과 같이 불리며, 제작자에 따라 철자·접두어(키 범위, 레인지)·버전 표기가 달라질 수 있습니다.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      따라서 명칭만으로 판단하기보다는 다음 판별 기준을 우선 확인하시는 것이 정확합니다.
                    </p>
                    <div className="space-y-2.5 mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 음 리스트:</strong> 키와 각 음(예: D / A C D E F G A C). 음 리스트가 주어지면 음정 간격 패턴(모드/선법 계통)은 자동으로 결정됩니다.</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 악기 구조:</strong> 딩과 톤필드의 배치 순서.</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 레인지/레지스터:</strong> Low/Medium/High 표기, 옥타브 위치.</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      이 세 가지가 일치하면 명칭이 달라도 사운드 성격과 연주 감각은 본질적으로 동일합니다. 반대로 명칭이 음 개수, 배열에 따라 연주 시 뉘앙스와 난이도, 가격이 달라집니다.
                    </p>
                  </div>

                  {/* 5-3 */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">5-3. 대표 스케일 포트폴리오</p>
                    <div className="space-y-2.5 mb-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 현대 트렌드:</strong> F# Low Pygmy, E Amara, D Aegean</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 클래식 라인업:</strong> D Kurd, C# Annaziska, E Hijaz</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="font-semibold">· 유니크 셀렉션:</strong> D Saladin, E La Sirena, C Harmonic minor, E Equinox</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      그 외에도 다양한 음계의 핸드팬들을 YouTube에서 직접 들어보실 수 있습니다.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong className="font-semibold">예시:</strong> E Amara 18 handpan, D Kurd 9 handpan 등
                    </p>
                  </div>

                  {/* 5-4 */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">5-4. 구매 시 스케일 결정 가이드</p>
                    <div className="space-y-5">
                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">1) 직접 플레이 테스트</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          음악 이론을 몰라도 전혀 문제없습니다. 여러 음계의 핸드팬을 직접 듣고 쳐 보시면서, 귀와 마음에 가장 울림을 주는 소리를 선택하시는 것이 가장 좋은 시작입니다. 핸드팬은 즉흥 연주 문화가 중심이어서, 대부분의 입문자가 이 방식으로 자신에게 맞는 스케일을 찾습니다.
                        </p>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">2) 용도 기반 추천</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          구매 목적을 먼저 정리하시면 선택이 빨라집니다.
                        </p>
                        <div className="space-y-2.5">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            <strong className="font-semibold">· 웰니스·드론 중심:</strong> 단순하고 깊게 깔리는 사운드가 유리합니다. → 펜타토닉 스케일에 음 개수가 적은 악기들은 연주 난이도가 높지 않으면서도 충분한 무드를 연출할 수 있습니다.
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            <strong className="font-semibold">· 솔로 연주·작편·녹음:</strong> 다양한 음악적 활용도와 폭 넓은 표현을 위해 음 개수가 많은 악기가 유리합니다.
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">3) 레퍼런스 매칭</p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          가장 쉬운 방법은 유튜브를 통해 다양한 연주를 들어보고 마음에 드는 영상을 제작자에게 전달해서, 해당 영상의 악기를 레퍼런스로 원하시는 악기를 찾아가는 것입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isExpandableContentPage ? (
            // 자세히보기/간단히보기 기능이 있는 페이지는 첫 번째 문단은 항상 표시, 나머지는 접기/펼치기
            (() => {
              // FAQ ID 41 (바텀 업그레이드)의 경우 카드 형태로 구조화된 내용 표시
              if (faq.id === "41") {
                return (
                  <div className="space-y-6">
                    {/* 제목 및 소개 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          바텀 업그레이드 안내
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          (Bottom Upgrade – 하단 베이스 노트 추가 서비스)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          SND Handpan 공식 기술지원 문서
                        </p>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                        <p>
                          최근 유튜브 및 SNS에서 많이 접하시는 감성적인 핸드팬 연주는, 대부분 <strong className="font-semibold">하단 베이스 딩(Ding)</strong>이 추가된 악기를 기반으로 이루어집니다. 이러한 악기들은 상단의 기본 딩 1개에 더해 하단에 2개의 베이스 노트가 포함되어 있어, 하나의 악기 안에서 베이스라인–코드–멜로디를 동시에 표현할 수 있는 스토리텔링 기반의 현대적 연주 스타일이 가능합니다.
                        </p>
                        <p>
                          하지만 이미 9~10개 음 구성의 일반 악기를 사용 중이신 경우, 새로운 뮤턴트 악기를 새로 구매하는 것이 가격적으로 부담되거나, 현재 사용 중인 악기에 애정이 있어 계속 사용하고 싶으신 경우도 많습니다. 이러한 상황을 고려하여 SND Handpan에서는 현재 가지고 계신 일반 악기의 하단에 베이스 딩 2개를 추가하는 <strong className="font-semibold">'바텀 업그레이드(Bottom Upgrade)'</strong> 서비스를 제공하고 있습니다.
                        </p>
                      </div>
                    </div>

                    {/* 작업 방식 및 기술적 특징 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          작업 방식 및 기술적 특징
                        </h3>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                        <p>
                          바텀 업그레이드는 단순히 노트를 새로 뚫는 작업이 아니라, 새 악기를 제작하는 것에 준하는 고난도 공정을 포함합니다.
                        </p>
                        <ul className="list-none space-y-4 ml-0">
                          <li>
                            <strong className="font-semibold">• 상·하판 분리</strong>
                            <p className="mt-1 ml-4">이미 접착된 두 판을 손상 없이 분리하는 작업은 높은 기술을 요구합니다.</p>
                          </li>
                          <li>
                            <strong className="font-semibold">• 하판 베이스 노트 신규 제작 및 튜닝</strong>
                            <p className="mt-1 ml-4">하단에 두 개의 베이스 딩을 추가하고, 각각의 음정·진동모드·하모닉스 구조(1:2:3)를 정밀하게 튜닝합니다.</p>
                          </li>
                          <li>
                            <strong className="font-semibold">• 재접착 및 구조 복원</strong>
                            <p className="mt-1 ml-4">하판을 다시 결합한 후 악기 전체의 공명 구조가 안정적으로 유지되도록 정교한 정렬 작업이 필요합니다.</p>
                          </li>
                          <li>
                            <strong className="font-semibold">• 최종 전체 튜닝 및 전수 점검 포함</strong>
                            <p className="mt-1 ml-4">바텀 업그레이드 과정에는 별도로 진행할 경우 비용이 발생하는 <strong className="font-semibold">전체 음역대의 재점검·재튜닝(전수튜닝)</strong>이 추가 비용 없이 포함됩니다.</p>
                          </li>
                        </ul>
                        <p className="mt-4">
                          이 모든 과정은 새 악기 제작과 동일한 시간과 기술이 투입되는 공정입니다.
                        </p>
                      </div>
                    </div>

                    {/* 비용 안내 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          비용 안내
                        </h3>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                        <ul className="list-none space-y-2 ml-0">
                          <li>재접착 공정: <strong className="font-semibold">400,000원</strong></li>
                          <li>베이스 딩(노트) 추가: <strong className="font-semibold">300,000원 × 2개 = 600,000원</strong></li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            총 비용: <span className="text-[#14B8A6]">1,000,000원</span>
                          </p>
                        </div>
                        <p className="mt-4">
                          이는 새 뮤턴트 악기를 구매하거나, 이미 하판에 베이스 노트가 포함된 악기를 중고로 구매하는 것보다 가격 대비 효율이 높은 업그레이드 옵션입니다.
                        </p>
                      </div>
                    </div>

                    {/* 바텀 업그레이드의 장점 */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                      <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          바텀 업그레이드의 장점
                        </h3>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        <ul className="list-disc list-inside space-y-3 ml-4">
                          <li>현재 보유한 악기를 그대로 유지하면서 뮤턴트 연주 스타일 구현 가능</li>
                          <li>하단 베이스라인을 통해 현대적 감성·화성 기반 연주 가능</li>
                          <li>새 악기를 구매하는 것보다 경제적</li>
                          <li>업그레이드 과정에서 전체 검수·전수 튜닝 포함 → 악기 컨디션 개선 효과</li>
                          <li>개인이 아끼던 악기의 고유 음색·특성 유지</li>
                          <li>최근 트렌드(베이스 화성 기반 연주)에 적합하여 연주 폭이 크게 확장</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }
              
              const paragraphs = displayContent.split("\n\n");
              const firstParagraph = paragraphs[0];
              
              // FAQ ID 20의 경우 특별 처리: 첫 2개 문단은 카드로 표시, 도표는 자세히보기 영역에 표시
              if (faq.id === "20") {
                const secondParagraph = paragraphs[1] || "";
                const thirdParagraph = paragraphs[2] || "";
                const remainingParagraphs = paragraphs.slice(3);
                
                return (
                  <>
                    {/* 첫 번째 문단 - 카드 형태로 표시 */}
                    <div className="mb-6">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {convertUrlsToLinks(firstParagraph)}
                        </div>
                      </div>
                    </div>
                    
                    {/* 두 번째 문단 - 카드 형태로 표시 */}
                    {secondParagraph && (
                      <div className="mb-6">
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                          <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {convertUrlsToLinks(secondParagraph)}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 세 번째 문단 - 본문 상단에 표시 */}
                    {thirdParagraph && (
                      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {convertUrlsToLinks(thirdParagraph)}
                      </p>
                    )}
                    
                    {/* 자세히보기 버튼 - 도표가 있으므로 항상 표시 */}
                    <button
                      onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
                      className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                    >
                      <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
                    
                    {/* 자세히보기 영역 - 도표만 표시 */}
                    {isContentDetailExpanded && (
                      <div className="mt-4">
                        {/* 하모닉스 그래프 */}
                        <div className="mb-6">
                          <Harmonics123Plot />
                        </div>
                        
                        {/* 나머지 문단 */}
                        {remainingParagraphs.length > 0 && remainingParagraphs.map((paragraph: string, index: number) => (
                          <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {convertUrlsToLinks(paragraph)}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                );
              }
              
              // FAQ ID 19의 경우 첫 번째 문단을 카드로 표시
              if (faq.id === "19") {
                const remainingParagraphs = paragraphs.slice(1);

                return (
                  <>
                    {/* 튜닝 작업 이미지 */}
                    <div className="mb-6">
                      <img
                        src="/images/tuning-work.jpg"
                        alt="핸드팬 튜닝 작업"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>

                    {/* 첫 번째 문단 - 카드 형태로 표시 */}
                    <div className="mb-6">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {convertUrlsToLinks(firstParagraph)}
                        </div>
                      </div>
                    </div>
                    
                    {/* 자세히보기 버튼 */}
                    {remainingParagraphs.length > 0 && (
                      <button
                        onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
                        className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                      >
                        <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
                    )}
                    
                    {/* 나머지 문단 - 접기/펼치기 */}
                    {isContentDetailExpanded && (
                      <div className="mt-4 space-y-6">
                        {remainingParagraphs.length > 0 && remainingParagraphs.map((paragraph: string, index: number) => (
                          <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                              {convertUrlsToLinks(paragraph)}
                            </div>
                          </div>
                        ))}

                        {/* FAQ ID "19"에만 장력 튜닝 GIF 애니메이션 추가 */}
                        {faq.id === "19" && (
                          <div className="mt-6">
                            <img
                              src="/images/tension.gif"
                              alt="핸드팬 장력 튜닝 애니메이션"
                              className="w-full h-auto rounded-lg"
                            />
                            <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">
                              핸드팬 톤필드 장력 정렬 개념도
                            </p>
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                              (Elastic Tension Tuning Conceptual Map)
                            </p>
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                              — SND Handpan 하모닉스톤 활성화 원리를 시각적으로 추상화한 기술 개념도 —
                            </p>
                          </div>
                        )}

                        {/* 개념도 설명 텍스트 카드 추가 */}
                        {faq.id === "19" && (
                          <div className="mt-6 space-y-6">
                            {/* 개요 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                개요
                              </h3>
                              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                <p className="mb-4">
                                  이 영상은 핸드팬 톤필드 내부에서 실제로 작용하는 <strong className="font-semibold">보이지 않는 장력(tension)</strong>이 튜닝 과정에서 어떻게 재배분되고, 그 결과 하모닉스톤이 활성화되는지 이해하기 위한 추상화된 개념적 설명 모델입니다.
                                </p>
                              </div>
                            </div>

                            {/* 튜닝 과정 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                튜닝 과정
                              </h3>
                              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                <p className="mb-4">
                                  튜닝 초기의 톤필드는 장력이 불균일하여 기본음–옥타브–복합5도(1:2:3)의 세 하모닉 모드가 안정적으로 결속되지 못한 상태에서 시작합니다. 튜너는 톤필드의 내·외부를 360도 방향에서 해머링하며 금속의 탄성·응력·장력 분포를 미세하게 조정하고, 이를 통해 점차 탄력 있고 팽팽한 Elastic Tension을 만들어갑니다.
                                </p>
                                <p>
                                  장력이 균일하게 정렬될수록 세 주파수의 오차가 줄고, 모드 간 진동의 <strong className="font-semibold">위상적 일치</strong>가 촉진되며, 전체 공명 구조가 안정화되는 경향을 보입니다.
                                </p>
                              </div>
                            </div>

                            {/* 성능 향상 요소 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                성능 향상 요소
                              </h3>
                              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                <p className="mb-4">이러한 장력 상태는 다음 특성에 유리하게 작용합니다:</p>
                                <ul className="list-none space-y-4 ml-0">
                                  <li>
                                    <strong className="font-semibold">• 디튠 내성(detune resistance)</strong>: 국부 변형에 의해 음정이 쉽게 흐트러지지 않는 경향
                                  </li>
                                  <li>
                                    <strong className="font-semibold">• 피치 드리프트 복원력(pitch drift resilience)</strong>: 온도·충격 등 외부 요인에 의한 피치 변화를 비교적 안정적으로 회복
                                  </li>
                                  <li>
                                    <strong className="font-semibold">• 공명 선명도(clarity)</strong>: 비의도적 모드 분할이 줄어들어 하모닉스 구조가 더 뚜렷해짐
                                  </li>
                                  <li>
                                    <strong className="font-semibold">• 음색의 깊이(perceived depth)</strong>: 기본음과 배음 결속이 안정되어 더 풍부하고 입체적으로 느껴짐
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* 시각화 설명 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                시각화 설명
                              </h3>
                              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                                <p>
                                  영상 속 앵커(anchor)는 <strong className="font-semibold">실제 구조물이 아니라</strong>, 튜닝 과정의 장력 이동과 콤프레션·텐션 재정렬의 원리를 이해하기 위한 시각적 비유 장치로 사용된 것입니다. 붉은 인장막은 장력이 당겨지는 강도를 표시하기 위한 그래픽 요소이며, 내부의 연두·노란색 영역이 밝아지는 변화는 하모닉스톤이 활성화되는 정도를 표현하기 위한 추상적 시각화입니다.
                                </p>
                              </div>
                            </div>

                            {/* 참고 */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                참고
                              </h3>
                              <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                <p>
                                  따라서 이 자료는 실제 물리 구조를 그대로 재현한 것이 아니라, SND Handpan의 Elastic Tension Tuning 기법과 하모닉스톤 활성화 원리를 시각적으로 이해하기 쉽도록 단순화한 개념적 참조 모델입니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* FAQ ID "19"에만 그래프 추가 - 총 24개 (애니메이션 프레임) */}
                        {/* 24개 프레임 다이어그램 비활성화 - PNG 파일로 저장 완료 */}
                        {/* {Array.from({ length: 24 }, (_, i) => (
                          <div key={`diagram-${i}`} className="mt-6 w-full overflow-hidden">
                            <div className="w-full max-w-full">
                              <TonefieldTensionDiagram
                                width={720}
                                height={480}
                                color="#14B8A6"
                                frameParams={ANIMATION_FRAME_PARAMS[i]}
                              />
                            </div>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </>
                );
              }
              
              // 다른 expandableContentPage는 기존 로직 유지
              const remainingParagraphs = paragraphs.slice(1);
              
              return (
                <>
                  {/* 첫 번째 문단 - 항상 표시 */}
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {convertUrlsToLinks(firstParagraph)}
                  </p>
                  
                  {/* 자세히보기 버튼 */}
                  {remainingParagraphs.length > 0 && (
                    <button
                      onClick={() => setIsContentDetailExpanded(!isContentDetailExpanded)}
                      className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0d9488] transition-colors font-medium"
                    >
                      <span>{isContentDetailExpanded ? t("간단히보기") : t("자세히보기")}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isContentDetailExpanded ? 'rotate-180' : ''}`}
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
                  )}
                  
                  {/* 나머지 문단 - 접기/펼치기 */}
                  {isContentDetailExpanded && (
                    <div className="mt-4">
                      {remainingParagraphs.length > 0 && remainingParagraphs.map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {convertUrlsToLinks(paragraph)}
                        </p>
                      ))}

                      {/* FAQ ID "19"에만 장력 튜닝 GIF 애니메이션 추가 (모바일) */}
                      {faq.id === "19" && (
                        <div className="mt-6">
                          <img
                            src="/images/tension.gif"
                            alt="핸드팬 장력 튜닝 애니메이션"
                            className="w-full h-auto rounded-lg"
                          />
                          <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">
                            핸드팬 톤필드 장력 정렬 개념도
                          </p>
                          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                            (Elastic Tension Tuning Conceptual Map)
                          </p>
                          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                            — SND Handpan 하모닉스톤 활성화 원리를 시각적으로 추상화한 기술 개념도 —
                          </p>
                        </div>
                      )}

                      {/* 개념도 설명 텍스트 카드 추가 (모바일) */}
                      {faq.id === "19" && (
                        <div className="mt-6 space-y-6">
                          {/* 개요 */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                              개요
                            </h3>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                              <p className="mb-4">
                                이 영상은 핸드팬 톤필드 내부에서 실제로 작용하는 <strong className="font-semibold">보이지 않는 장력(tension)</strong>이 튜닝 과정에서 어떻게 재배분되고, 그 결과 하모닉스톤이 활성화되는지 이해하기 위한 추상화된 개념적 설명 모델입니다.
                              </p>
                            </div>
                          </div>

                          {/* 튜닝 과정 */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                              튜닝 과정
                            </h3>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                              <p className="mb-4">
                                튜닝 초기의 톤필드는 장력이 불균일하여 기본음–옥타브–복합5도(1:2:3)의 세 하모닉 모드가 안정적으로 결속되지 못한 상태에서 시작합니다. 튜너는 톤필드의 내·외부를 360도 방향에서 해머링하며 금속의 탄성·응력·장력 분포를 미세하게 조정하고, 이를 통해 점차 탄력 있고 팽팽한 Elastic Tension을 만들어갑니다.
                              </p>
                              <p>
                                장력이 균일하게 정렬될수록 세 주파수의 오차가 줄고, 모드 간 진동의 <strong className="font-semibold">위상적 일치</strong>가 촉진되며, 전체 공명 구조가 안정화되는 경향을 보입니다.
                              </p>
                            </div>
                          </div>

                          {/* 성능 향상 요소 */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                              성능 향상 요소
                            </h3>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                              <p className="mb-4">이러한 장력 상태는 다음 특성에 유리하게 작용합니다:</p>
                              <ul className="list-none space-y-4 ml-0">
                                <li>
                                  <strong className="font-semibold">• 디튠 내성(detune resistance)</strong>: 국부 변형에 의해 음정이 쉽게 흐트러지지 않는 경향
                                </li>
                                <li>
                                  <strong className="font-semibold">• 피치 드리프트 복원력(pitch drift resilience)</strong>: 온도·충격 등 외부 요인에 의한 피치 변화를 비교적 안정적으로 회복
                                </li>
                                <li>
                                  <strong className="font-semibold">• 공명 선명도(clarity)</strong>: 비의도적 모드 분할이 줄어들어 하모닉스 구조가 더 뚜렷해짐
                                </li>
                                <li>
                                  <strong className="font-semibold">• 음색의 깊이(perceived depth)</strong>: 기본음과 배음 결속이 안정되어 더 풍부하고 입체적으로 느껴짐
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* 시각화 설명 */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                              시각화 설명
                            </h3>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                              <p>
                                영상 속 앵커(anchor)는 <strong className="font-semibold">실제 구조물이 아니라</strong>, 튜닝 과정의 장력 이동과 콤프레션·텐션 재정렬의 원리를 이해하기 위한 시각적 비유 장치로 사용된 것입니다. 붉은 인장막은 장력이 당겨지는 강도를 표시하기 위한 그래픽 요소이며, 내부의 연두·노란색 영역이 밝아지는 변화는 하모닉스톤이 활성화되는 정도를 표현하기 위한 추상적 시각화입니다.
                              </p>
                            </div>
                          </div>

                          {/* 참고 */}
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                              참고
                            </h3>
                            <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                              <p>
                                따라서 이 자료는 실제 물리 구조를 그대로 재현한 것이 아니라, SND Handpan의 Elastic Tension Tuning 기법과 하모닉스톤 활성화 원리를 시각적으로 이해하기 쉽도록 단순화한 개념적 참조 모델입니다.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FAQ ID "19"에만 그래프 추가 - 총 24개 (애니메이션 프레임) */}
                      {/* 24개 프레임 다이어그램 비활성화 - PNG 파일로 저장 완료 */}
                      {/* {faq.id === "19" && (
                        <>
                          {Array.from({ length: 24 }, (_, i) => (
                            <div key={`diagram-mobile-${i}`} className="mt-6 w-full overflow-hidden">
                              <div className="w-full max-w-full">
                                <TonefieldTensionDiagram
                                  width={720}
                                  height={480}
                                  color="#14B8A6"
                                  frameParams={ANIMATION_FRAME_PARAMS[i]}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )} */}
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            // 일반 페이지는 기존 방식대로 표시
            displayContent.split("\n\n").map((paragraph: string, index: number) => {
              // FAQ ID 20의 경우 하모닉스 설명 단락 아래에 그래프 삽입
              const isHarmonicsParagraph = faq.id === "20" && (
                paragraph.includes("하모닉스(Harmonics)는 기본 음에 자연스럽게 겹쳐 들리는 배음을 말합니다") ||
                paragraph.includes("Harmonics are overtones that naturally overlap with the fundamental tone")
              );
              
              return (
                <React.Fragment key={index}>
                  <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {convertUrlsToLinks(paragraph)}
              </p>
                  {isHarmonicsParagraph && (
                    <div className="mb-6 mt-4">
                      <Harmonics123Plot />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
