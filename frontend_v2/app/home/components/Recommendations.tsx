"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export interface RecommendationsProps {
  risk: number
  label: string
  tumorDetected?: boolean
  tumorConfidence?: number
  cancerStage?: {
    predicted_class: string
    confidence: number
    is_malignant: boolean
    is_benign: boolean
    is_normal: boolean
  }
  patientInfo?: {
    age: number
    gender: number
    health_factors: Record<string, number>
  }
  overlayImage?: string  // base64 encoded image with highlighted areas
  onNewCase: () => void
  hasNewResult?: boolean  // Flag to indicate if there's a new result
  originalImage?: string  // Original CT scan image
  onRecommendationsLoaded?: (recommendations: string) => void  // Callback when recommendations are loaded
}

// Enhanced markdown formatter for medical content with proper nested structure
const formatMedicalMarkdown = (text: string): string => {
  let html = text

  // First, handle bold text: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')

  // Split by lines to process structure
  const lines = html.split('\n')
  const processedLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Medical section headers
    if (line.includes('THÔNG TIN BỆNH NHÂN:')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">THÔNG TIN BỆNH NHÂN:</div>')
      continue
    }
    if (line.includes('KẾT QUẢ PHÂN TÍCH AI')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">KẾT QUẢ PHÂN TÍCH AI CHUYÊN NGHIỆP:</div>')
      continue
    }
    if (line.includes('NHẬN ĐỊNH LÂM SÀNG:')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">NHẬN ĐỊNH LÂM SÀNG:</div>')
      continue
    }
    if (line.includes('PHÂN TÍCH CHI TIẾT HÌNH ẢNH:')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">PHÂN TÍCH CHI TIẾT HÌNH ẢNH:</div>')
      continue
    }
    if (line.includes('KHUYẾN NGHỊ Y KHOA:')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">KHUYẾN NGHỊ Y KHOA:</div>')
      continue
    }
    if (line.includes('LƯU Ý QUAN TRỌNG:')) {
      processedLines.push('<div class="text-orange-400 font-semibold mb-3 mt-4 text-base">LƯU Ý QUAN TRỌNG:</div>')
      continue
    }

    // Skip empty lines
    if (!line.trim()) {
      processedLines.push('')
      continue
    }

    // Detect indentation level for nested items
    const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0
    const indentLevel = Math.floor(leadingSpaces / 3)
    const trimmedLine = line.trim()

    // Numbered list items: 1. **text**
    if (/^\d+\.\s+/.test(trimmedLine)) {
      const match = trimmedLine.match(/^(\d+)\.\s+(.*)$/)
      if (match) {
        const [, num, content] = match
        // Remove ** from content if present
        const cleanContent = content.replace(/\*\*/g, '')
        processedLines.push(`<div class="mt-3 mb-2 flex gap-3"><span class="inline-block w-6 h-6 bg-blue-600 text-white text-xs rounded-full text-center leading-6 flex-shrink-0">${num}</span><div class="flex-1">${cleanContent}</div></div>`)
      }
      continue
    }

    // Bullet points with indentation (•, -, or *)
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      const content = trimmedLine.replace(/^[•\-*]\s*/, '')
      // Calculate margin based on indent level
      let marginClass = 'ml-2'
      if (indentLevel === 1) marginClass = 'ml-6'
      else if (indentLevel === 2) marginClass = 'ml-10'
      else if (indentLevel >= 3) marginClass = 'ml-14'

      processedLines.push(`<div class="mt-1.5 mb-1 ${marginClass} flex gap-2"><span class="text-blue-400 flex-shrink-0 text-sm">•</span><span class="text-white/90 text-sm">${content}</span></div>`)
      continue
    }

    // Regular text
    if (trimmedLine) {
      processedLines.push(`<div class="text-white/90 text-sm leading-relaxed">${trimmedLine}</div>`)
    }
  }

  return processedLines.join('')
}

export function Recommendations({ risk, label, tumorDetected = false, cancerStage, patientInfo, overlayImage, onNewCase, hasNewResult = false, onRecommendationsLoaded }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Fallback recommendations
  const fallbackItems = risk > 0.66
    ? ['Ưu tiên khám chuyên khoa hô hấp/ung bướu', 'Theo dõi CT liều thấp và xét nghiệm bổ sung', 'Chương trình cai thuốc lá và giảm yếu tố nguy cơ']
    : risk > 0.33
    ? ['Lên lịch tầm soát hoặc tái khám theo hướng dẫn', 'Thay đổi lối sống: bỏ thuốc, vận động, dinh dưỡng', 'Theo dõi triệu chứng và khám định kỳ']
    : ['Duy trì lối sống lành mạnh, tầm soát định kỳ', 'Hạn chế khói bụi và khói thuốc thụ động', 'Đánh giá lại yếu tố nguy cơ hằng năm']

  // Only fetch recommendations when there's a new result
  useEffect(() => {
    if (hasNewResult && !hasLoaded) {
      fetchRecommendations()
    }
  }, [hasNewResult, hasLoaded])

  const cleanResponse = (text: string): string => {
    // Remove lines like "Tuyệt vời, tôi sẽ phân tích..."
    return text
      .split('\n')
      .filter(line => !line.match(/^(Tuyệt vời|Được rồi|Tôi sẽ|Hiểu rồi|Vâng|Chắc chắn)/i))
      .join('\n')
      .trim()
  }

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true)
      setHasLoaded(true)

      // Filter out cancer stage if confidence < 20%
      const filteredCancerStage = cancerStage && cancerStage.confidence >= 0.2 ? cancerStage : undefined

      const response = await fetch('http://localhost:5001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lung_cancer_risk: risk,
          lung_cancer_label: label,
          tumor_detected: tumorDetected,
          cancer_stage: filteredCancerStage,
          patient_info: patientInfo,
          overlay_image: overlayImage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      // If we get a full response text, use it; otherwise use the recommendations array
      if (data.full_response) {
        const cleanedResponse = cleanResponse(data.full_response)
        setRecommendations([cleanedResponse])
        // Call callback with full response
        if (onRecommendationsLoaded) {
          onRecommendationsLoaded(cleanedResponse)
        }
      } else {
        setRecommendations(data.recommendations || fallbackItems)
        // Call callback with recommendations
        if (onRecommendationsLoaded) {
          onRecommendationsLoaded((data.recommendations || fallbackItems).join('\n'))
        }
      }

    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations(fallbackItems)
      // Call callback with fallback
      if (onRecommendationsLoaded) {
        onRecommendationsLoaded(fallbackItems.join('\n'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const items = recommendations.length > 0 ? recommendations : fallbackItems

  return (
    <div className="mt-6 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-bold text-white">
            Khuyến nghị của AI
          </h4>
          {isLoading && (
            <div className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}
        </div>
        
        {!hasNewResult && !isLoading && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchRecommendations}
            className="rounded-full h-8 px-4 text-xs"
          >
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tạo khuyến nghị mới
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-neutral-800/40 rounded-xl border border-white/5 p-4 min-h-[200px]">
        {!hasNewResult && !hasLoaded ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="p-4 bg-blue-500/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h5 className="text-white font-semibold mb-2">Chưa có khuyến nghị</h5>
            <p className="text-white/60 text-sm mb-4">Nhấn "Tạo khuyến nghị mới" để AI phân tích và đưa ra khuyến nghị</p>
            <Button 
              onClick={fetchRecommendations}
              className="rounded-full h-8 px-4 text-xs"
            >
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tạo khuyến nghị
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-white/60 text-sm">AI đang phân tích và tạo khuyến nghị...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Check if we have a single full response or multiple recommendations */}
            {items.length === 1 && (items[0].includes('NHẬN ĐỊNH LÂM SÀNG') || items[0].includes('KHUYẾN NGHỊ Y KHOA')) ? (
              // Full medical report format
              <div
                className="text-white/90 text-sm leading-relaxed space-y-3 max-h-96 overflow-y-auto scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: formatMedicalMarkdown(items[0])
                }}
              />
            ) : (
              // Traditional list format for fallback
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-neutral-700/30 rounded-lg border border-white/5">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-400 text-xs font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-white/50">
          {hasLoaded && `Cập nhật lần cuối: ${new Date().toLocaleTimeString('vi-VN')}`}
        </div>
        <div className="flex gap-2">
          {hasLoaded && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchRecommendations}
              className="rounded-full h-8 px-4 text-xs"
            >
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full h-8 px-4 text-xs" 
            onClick={onNewCase}
          >
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Trường hợp mới
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Recommendations


