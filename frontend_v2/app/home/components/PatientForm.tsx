"use client"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

type Scores = Record<string, number>

export interface PatientFormProps {
  formAge: number
  setFormAge: (v: number) => void
  gender: number
  setGender: (v: number) => void
  scores: Scores
  setScores: (updater: (s: Scores) => Scores) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function PatientForm({ formAge, setFormAge, gender, setGender, scores, setScores, onSubmit, isSubmitting }: PatientFormProps) {
  const sliderConfig: { key: keyof Scores; label: string; min: number; max: number }[] = [
    { key: "air_pollution", label: "Ô nhiễm không khí", min: 1, max: 8 },
    { key: "alcohol_use", label: "Sử dụng rượu bia", min: 1, max: 8 },
    { key: "dust_allergy", label: "Dị ứng bụi", min: 1, max: 8 },
    { key: "occupational_hazards", label: "Nguy hiểm nghề nghiệp", min: 1, max: 8 },
    { key: "genetic_risk", label: "Nguy cơ di truyền", min: 1, max: 7 },
    { key: "chronic_lung_disease", label: "Bệnh phổi mãn tính", min: 1, max: 7 },
    { key: "balanced_diet", label: "Chế độ ăn cân bằng", min: 1, max: 8 },
    { key: "obesity", label: "Béo phì", min: 1, max: 8 },
    { key: "smoking", label: "Hút thuốc", min: 1, max: 8 },
    { key: "passive_smoker", label: "Hút thuốc thụ động", min: 1, max: 8 },
    { key: "chest_pain", label: "Đau ngực", min: 1, max: 8 },
    { key: "coughing_of_blood", label: "Ho ra máu", min: 1, max: 8 },
    { key: "fatigue", label: "Mệt mỏi", min: 1, max: 8 },
    { key: "weight_loss", label: "Giảm cân", min: 1, max: 8 },
    { key: "shortness_of_breath", label: "Khó thở", min: 1, max: 8 },
    { key: "wheezing", label: "Thở khò khè", min: 1, max: 8 },
    { key: "swallowing_difficulty", label: "Khó nuốt", min: 1, max: 8 },
    { key: "clubbing_of_finger_nails", label: "Móng tay dùi trống", min: 1, max: 8 },
    { key: "frequent_cold", label: "Cảm lạnh thường xuyên", min: 1, max: 8 },
    { key: "dry_cough", label: "Ho khan", min: 1, max: 8 },
    { key: "snoring", label: "Ngáy", min: 1, max: 8 },
  ]

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Thông tin bệnh nhân</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1">Tuổi</label>
          <Input
            type="number"
            min={0}
            max={120}
            value={formAge}
            onChange={(e) => setFormAge(Number(e.target.value || 0))}
            className="bg-neutral-900 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <div>
          <label htmlFor="patient-gender" className="block text-xs font-medium text-white/60 mb-1">Giới tính</label>
          <select
            id="patient-gender"
            value={gender}
            onChange={(e) => setGender(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-white/10 text-white text-sm rounded-md px-3 py-2"
          >
            <option className="bg-neutral-900" value={1}>Nam</option>
            <option className="bg-neutral-900" value={0}>Nữ</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sliderConfig.map(({ key, label, min, max }) => (
            <div key={key as string}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">{label}</span>
                <span className="text-xs text-white/60">{Math.max(min, Math.min(max, scores[key as string]))}</span>
              </div>
              <Slider
                max={max}
                min={min}
                value={[Math.max(min, Math.min(max, scores[key as string]))]}
                onValueChange={(v) => setScores((s) => ({ ...s, [key as string]: v[0] }))}
              />
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button onClick={onSubmit} disabled={isSubmitting} className="w-full rounded-lg">
            {isSubmitting ? 'Analyzing...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PatientForm


