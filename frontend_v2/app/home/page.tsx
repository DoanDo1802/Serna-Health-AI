"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { UserMenu } from "@/components/user-menu"
import PatientForm from "./components/PatientForm"
import ImageUpload from "./components/ImageUpload"
import DiagnosisCard from "./components/DiagnosisCard"
import Recommendations from "./components/Recommendations"
import Chat, { type Message } from "./components/Chat"
import { Eye } from "lucide-react"
import ImageModal from "@/components/ImageModal"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])

  // Fetch user from Supabase
  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }

    getUser()
  }, [])
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formAge, setFormAge] = useState(45)
  const [gender, setGender] = useState<number>(1) // 1 = Male, 0 = Female
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const defaultScores: Record<string, number> = {
    air_pollution: 5,
    alcohol_use: 3,
    dust_allergy: 4,
    occupational_hazards: 3,
    genetic_risk: 4, // 1 - 7
    chronic_lung_disease: 3, // 1 - 7
    balanced_diet: 5,
    obesity: 3,
    smoking: 2,
    passive_smoker: 3,
    chest_pain: 2,
    coughing_of_blood: 1,
    fatigue: 3,
    weight_loss: 2,
    shortness_of_breath: 3,
    wheezing: 2,
    swallowing_difficulty: 2,
    clubbing_of_finger_nails: 1,
    frequent_cold: 3,
    dry_cough: 3,
    snoring: 4,
  }
  const [scores, setScores] = useState<Record<string, number>>(defaultScores)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<null | {
    risk: number;
    label: string;
    tumorResult?: {
      has_tumor: boolean;
      tumor_area: number;
      confidence: number;
      mask_image: string;
    };
    cancerStageResult?: {
      predicted_class: string;
      confidence: number;
      class_probabilities: {
        Benign: number;
        Malignant: number;
        Normal: number;
      };
      is_malignant: boolean;
      is_benign: boolean;
      is_normal: boolean;
    };
    overlayImageUrl?: string;
  }>(null)
  const [recommendations, setRecommendations] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setSelectedFile(file)
    // Allow selecting the same file again without page reload
    e.currentTarget.value = ''
  }

  const resetForNewCase = () => {
    setResult(null)
    setIsSubmitting(false)
    setFormAge(45)
    setGender(1)
    setScores(defaultScores)
    setImageUrl(null)
    setSelectedFile(null)
    setShowPreview(true)
  }

  const createOverlayImage = (originalImageUrl: string, maskBase64: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      const originalImg = new Image()
      const maskImg = new Image()

      originalImg.onload = () => {
        canvas.width = originalImg.width
        canvas.height = originalImg.height

        // Draw original image
        ctx.drawImage(originalImg, 0, 0)

        maskImg.onload = () => {
          // Create overlay with light blue color
          ctx.globalAlpha = 0.4
          ctx.fillStyle = '#ff0011ff' // Light blue

          // Draw mask as overlay
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')!
          tempCanvas.width = maskImg.width
          tempCanvas.height = maskImg.height

          tempCtx.drawImage(maskImg, 0, 0)
          const imageData = tempCtx.getImageData(0, 0, maskImg.width, maskImg.height)

          // Scale mask to match original image size
          const scaleX = originalImg.width / maskImg.width
          const scaleY = originalImg.height / maskImg.height

          for (let y = 0; y < maskImg.height; y++) {
            for (let x = 0; x < maskImg.width; x++) {
              const idx = (y * maskImg.width + x) * 4
              const alpha = imageData.data[idx] // Use red channel as mask

              if (alpha > 128) { // If mask pixel is bright (tumor detected)
                const scaledX = x * scaleX
                const scaledY = y * scaleY
                ctx.fillRect(scaledX, scaledY, scaleX, scaleY)
              }
            }
          }

          ctx.globalAlpha = 1.0
          resolve(canvas.toDataURL())
        }

        maskImg.src = maskBase64
      }

      originalImg.src = originalImageUrl
    })
  }

  const normalizeLungResponse = (resp: any): { risk: number; label: 'High risk'|'Moderate risk'|'Low risk' } => {
    try {
      // Backend now returns prediction as string label
      const prediction = resp.prediction ?? 'Low'

      // Map backend prediction to frontend format
      const label: 'High risk'|'Moderate risk'|'Low risk' =
        prediction === 'High' ? 'High risk' :
        prediction === 'Medium' ? 'Moderate risk' : 'Low risk'

      // Set risk number based on label for UI purposes
      const riskNum = prediction === 'High' ? 0.8 : prediction === 'Medium' ? 0.5 : 0.2

      return { risk: riskNum, label }
    } catch {
      return { risk: 0, label: 'Low risk' }
    }
  }

  const handleSubmitPreview = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Prepare patient data for lung cancer prediction
      const patientData = {
        age: formAge,
        gender: gender,
        ...scores
      }

      // Call lung cancer prediction API
      const lungCancerResponse = await fetch('http://localhost:5001/api/predict/lung-cancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      })

      if (!lungCancerResponse.ok) {
        throw new Error('Lung cancer prediction failed')
      }

      const lungCancerResult = await lungCancerResponse.json()
      const { risk, label } = normalizeLungResponse(lungCancerResult)

      let tumorResult = undefined
      let cancerStageResult = undefined
      let overlayImageUrl = undefined

      // If image is uploaded, call tumor segmentation and cancer stage APIs
      if (selectedFile) {
        const formData = new FormData()
        formData.append('image', selectedFile)
        formData.append('threshold', '0.5')

        // Call tumor segmentation API
        const tumorResponse = await fetch('http://localhost:5001/api/predict/tumor', {
          method: 'POST',
          body: formData
        })

        if (tumorResponse.ok) {
          tumorResult = await tumorResponse.json()

          // Create overlay image if tumor is detected
          if (tumorResult.has_tumor && tumorResult.mask_image && imageUrl) {
            overlayImageUrl = await createOverlayImage(imageUrl, tumorResult.mask_image)
          }
        }

        // Call cancer stage classification API
        const stageFormData = new FormData()
        stageFormData.append('image', selectedFile)

        const stageResponse = await fetch('http://localhost:5001/api/predict/cancer-stage', {
          method: 'POST',
          body: stageFormData
        })

        if (stageResponse.ok) {
          const stageData = await stageResponse.json()
          // Only use cancer stage result if confidence >= 20%
          if (stageData.confidence >= 0.2) {
            cancerStageResult = stageData
          }
        }
      }

      setResult({
        risk,
        label,
        tumorResult,
        cancerStageResult,
        overlayImageUrl
      })

      if (!showPreview) setShowPreview(true)

    } catch (error) {
      console.error('API Error:', error)

      // Fallback to mock calculation if API fails
      const entries = Object.entries(scores) as [string, number][]
      const sum = entries.reduce((acc, [, v]) => acc + v, 0)
      const maxSum = 2 * 7 + 19 * 8
      const ageFactor = Math.min(1, Math.max(0, (formAge - 30) / 50))
      const genderFactor = gender === 1 ? 1.05 : 1.0
      const risk = Math.min(1, (sum / maxSum) * 0.85 * genderFactor + ageFactor * 0.15)
      const label = risk > 0.66 ? "High risk" : risk > 0.33 ? "Moderate risk" : "Low risk"

      setResult({ risk, label })
      if (!showPreview) setShowPreview(true)

      // Silent fallback to mock to avoid blocking UX
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/images/bacground_serna_v2-2.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative z-10 flex h-full w-full gap-4 p-4">
        {/* Left side - Chat Interface */}
        <div className="w-full lg:w-[440px] flex flex-col h-full rounded-lg bg-neutral-950 border border-neutral-600/80">
          {/* Header */}
          <header className="shrink-0 border-b border-white/10 bg-neutral-900/40 backdrop-blur-xl h-12 flex items-center justify-between px-4 rounded-t-lg">
            <div className="font-extrabold text-white tracking-tight">Serna Health AI</div>
          </header>

          {/* Chat Component */}
          <Chat
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            hasPatientInfo={!!result}
            patientInfo={result ? {
              age: formAge,
              gender: gender,
              health_factors: scores
            } : undefined}
            diagnosisResult={result ? {
              clinical_assessment: recommendations,
              full_response: recommendations,
              recommendations: recommendations,
              important_notes: recommendations,
              xgboost_result: {
                risk_level: result.label,
                probability: result.risk
              },
              tumor_result: result.tumorResult ? {
                has_tumor: result.tumorResult.has_tumor,
                confidence: result.tumorResult.confidence
              } : undefined,
              cancer_stage: result.cancerStageResult ? {
                stage: result.cancerStageResult.predicted_class,
                confidence: result.cancerStageResult.confidence
              } : undefined
            } : undefined}
          />
        </div>

        {/* Right side - Preview Panel */}
        <div className="hidden lg:flex flex-1 flex-col bg-neutral-900/30 rounded-lg border border-neutral-600/80">
          {/* Preview Header */}
          <header className="shrink-0 border-b border-white/10 bg-neutral-900/40 backdrop-blur-xl h-12 px-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-white/60" />
              <h2 className="text-sm font-semibold text-white">Preview</h2>
            </div>
            {!isLoadingUser && user && <UserMenu user={user} />}
          </header>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {!showPreview ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center mx-auto mb-4"
                    aria-label="Open preview"
                  >
                    <Eye className="h-8 w-8 text-white/80" />
                  </button>
                  <h3 className="text-xl font-semibold text-white mb-2">Preview is hidden</h3>
                  <p className="text-white/60 text-sm">Click the eye icon to open the preview.</p>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                {/* Preview Frame */}
                <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Browser-like header */}
                  <div className="bg-neutral-900/80 border-b border-white/10 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        aria-label="Close preview"
                        onClick={() => setShowPreview(false)}
                        className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400/80 transition"
                      />
                      <button
                        type="button"
                        aria-label="Back to form"
                        onClick={() => {
                          setResult(null)
                          setIsSubmitting(false)
                        }}
                        className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400/80 transition"
                      />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-neutral-800/50 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/40 max-w-xs truncate">
                        localhost:3000/preview
                      </div>
                    </div>
                  </div>

                  {/* Preview content */}
                  <div className="bg-neutral-950 p-8 min-h-[560px]">
                    {!result ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PatientForm
                          formAge={formAge}
                          setFormAge={setFormAge}
                          gender={gender}
                          setGender={setGender}
                          scores={scores}
                          setScores={(updater) => setScores((s) => updater(s))}
                          onSubmit={handleSubmitPreview}
                          isSubmitting={isSubmitting}
                        />

                        {/* Right: Square image upload */}
                        <div>
                          <ImageUpload imageUrl={imageUrl} onPick={() => fileInputRef.current?.click()} />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                            aria-label="Upload medical image"
                            title="Upload medical image"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                          {/* Left: Image */}
                          <div className="w-full">
                            <div
                              className="w-full aspect-square rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 group"
                              onDoubleClick={() => {
                                if (result?.overlayImageUrl || imageUrl) {
                                  setIsImageModalOpen(true)
                                }
                              }}
                            >
                              {result?.overlayImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={result.overlayImageUrl} 
                                  alt="CT scan with tumor overlay" 
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                />
                              ) : imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={imageUrl} 
                                  alt="uploaded CT scan" 
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-white/50 text-sm">
                                  <div className="text-center">
                                    <div className="text-4xl mb-2">📷</div>
                                    <div>No image uploaded</div>
                                    <div className="text-xs mt-1 opacity-60">Double-click to view when available</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Diagnosis card */}
                          <DiagnosisCard
                            patientInfoDiagnosis={{
                              cancer_probability:
                                (result!.label === 'High risk'
                                  ? 'high'
                                  : result!.label === 'Moderate risk'
                                  ? 'moderate'
                                  : 'low'),
                              risk_score: Math.round(result!.risk * 100),
                            }}
                            imageDiagnosis={{
                              abnormality_detection: result?.tumorResult
                                ? {
                                    has_abnormality: result.tumorResult.has_tumor,
                                    confidence: Math.round(result.tumorResult.confidence),
                                  }
                                : undefined,
                              cancer_classification: result?.cancerStageResult && result.cancerStageResult.confidence >= 0.2
                                ? {
                                    predicted_class: (result.cancerStageResult.predicted_class.toLowerCase() as 'malignant' | 'benign' | 'normal'),
                                    confidence: Math.round(result.cancerStageResult.confidence * 100),
                                  }
                                : undefined,
                            }}
                          />
                        </div>

                        {/* Advice section */}
                        <Recommendations
                          risk={result!.risk}
                          label={result!.label}
                          tumorDetected={result?.tumorResult?.has_tumor}
                          tumorConfidence={result?.tumorResult?.confidence}
                          cancerStage={result?.cancerStageResult}
                          patientInfo={{
                            age: formAge,
                            gender: gender,
                            health_factors: scores
                          }}
                          overlayImage={result?.overlayImageUrl}
                          originalImage={imageUrl || undefined}
                          onNewCase={resetForNewCase}
                          hasNewResult={true}
                          onRecommendationsLoaded={(recs) => setRecommendations(recs)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={result?.overlayImageUrl || imageUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4="}
        alt={result?.overlayImageUrl ? "CT scan with tumor overlay" : "Uploaded CT scan"}
      />
    </div>
  )
}
