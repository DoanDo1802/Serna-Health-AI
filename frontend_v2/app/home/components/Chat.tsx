"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

// CSS để ẩn scrollbar
const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  hasPatientInfo?: boolean
  patientInfo?: {
    age: number
    gender: number
    health_factors: Record<string, number>
  }
  diagnosisResult?: {
    clinical_assessment: string
    recommendations: string
    important_notes: string
    xgboost_result?: {
      risk_level: string
      probability: number
    }
    tumor_result?: {
      has_tumor: boolean
      confidence: number
    }
    cancer_stage?: {
      stage: string
      confidence: number
    }
  }
}

// Simple markdown formatter
const formatMarkdown = (text: string): string => {
  return text
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Line breaks: \n -> <br>
    .replace(/\n/g, '<br>')
    // Warning emoji: ⚠️ -> styled warning
    .replace(/⚠️/g, '<span style="color: #fbbf24;">⚠️</span>')
}

export default function Chat({ messages, setMessages, isLoading, setIsLoading, hasPatientInfo = false, patientInfo, diagnosisResult }: ChatProps) {
  const [input, setInput] = useState("")
  const [healthMode, setHealthMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Prepare message payload
      const payload: any = {
        message: currentInput
      }

      // Add patient info and diagnosis if Health Mode is enabled
      if (healthMode && patientInfo) {
        payload.patient_info = patientInfo
        if (diagnosisResult) {
          payload.diagnosis_result = diagnosisResult
        }
      }

      // Call chat API
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Chat API request failed')
      }

      // Create assistant message with empty content initially
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedContent = ""
        let streamCompleted = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            // Stream ended naturally, set loading to false
            setIsLoading(false)
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.text) {
                  accumulatedContent += data.text

                  // Update the assistant message with accumulated content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    )
                  )
                }

                if (data.done) {
                  setIsLoading(false)
                  streamCompleted = true
                  break
                }

                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError)
              }
            }
          }

          // Break outer loop if stream completed
          if (streamCompleted) {
            break
          }
        }
      }

    } catch (error) {
      console.error('Chat error:', error)

      // Fallback to mock response on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Xin lỗi, hiện tại tôi không thể kết nối với dịch vụ chat. Vui lòng thử lại sau.

Đây là phản hồi demo: Bạn đã hỏi "${currentInput}". Để nhận được tư vấn y tế chính xác, vui lòng tham khảo ý kiến bác sĩ chuyên khoa.`,
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    } finally {
      // Ensure loading is always set to false
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{scrollbarHideStyle}</style>
      <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-black scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Send className="h-6 w-6 text-white/40" />
              </div>
                  <h2 className="text-lg font-semibold text-white mb-1">AI Health Advisor</h2>
                  <p className="text-sm text-white/50">Ask about symptoms, risks, and lung cancer prevention.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    message.role === "user"
                      ? "bg-neutral-800 text-white border border-white/10"  
                      : "bg-neutral-800 text-white border border-white/10"
                  }`}
                >
                  {message.role === "user" ? "U" : "AI"}
                </div>
                <div
                    className={`flex-1 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[80%]">
                      <div
                        className={`text-xs font-medium text-white/60 mb-1 ${
                          message.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {message.role === "user" ? "You" : "Assistant"}
                      </div>

                      <div
                        className={`text-sm text-white/90 leading-relaxed ${
                          message.role === "user"
                            ? "bg-neutral-600/20 rounded-lg p-3 text-left"
                            : "text-left"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(message.content)
                        }}
                      />
                    </div>
                  </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-medium text-white shrink-0">
                AI
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-white/60 mb-1">Assistant</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-white/10 bg-neutral-900/60 backdrop-blur-xl p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-neutral-900 border border-white/20 rounded-lg px-3 py-2">
          {/* Textarea - Top */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about lung cancer symptoms or risks..."
            className="flex-1 h-[60px] resize-none bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-0 text-sm p-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* Controls - Bottom */}
          <div className="flex items-center justify-between gap-2">
            {/* Left - Health Mode + Status */}
            <div className="flex items-center gap-2">
              {/* Health Mode Button */}
              <Button
                type="button"
                size="sm"
                disabled={!hasPatientInfo}
                onClick={() => setHealthMode(!healthMode)}
                className={`rounded-full h-6 px-2 text-xs transition-all ${
                  healthMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                }`}
              >
                Health Mode
              </Button>

              {/* Status Indicator */}
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  hasPatientInfo ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={hasPatientInfo ? 'Patient info available' : 'No patient info'}
              />
            </div>

            {/* Right - Send Button */}
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full h-6 px-3 text-xs"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </form>
      </div>
      </div>
    </>
  )
}

