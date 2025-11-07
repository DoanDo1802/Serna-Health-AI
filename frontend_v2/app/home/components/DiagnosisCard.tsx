"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Shield, Activity, Target, Zap } from "lucide-react"

export interface DiagnosisCardProps {
  // Chẩn đoán theo thông tin bệnh nhân (XGBoost)
  patientInfoDiagnosis?: {
    cancer_probability: 'low' | 'moderate' | 'high';
    risk_score: number;
  };
  
  // Chẩn đoán theo hình ảnh (UNet + YOLO)
  imageDiagnosis?: {
    // UNet - Phát hiện bất thường
    abnormality_detection?: {
      has_abnormality: boolean;
      confidence: number;
    };
    // YOLO - Phân loại ung thư
    cancer_classification?: {
      predicted_class: 'malignant' | 'benign' | 'normal';
      confidence: number;
    };
  };
}

export function DiagnosisCard({ patientInfoDiagnosis, imageDiagnosis }: DiagnosisCardProps) {
  const getRiskConfig = (probability: string) => {
    switch (probability) {
      case 'high':
        return {
          color: 'destructive',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          icon: AlertTriangle,
          label: 'Nguy cơ cao'
        }
      case 'moderate':
        return {
          color: 'secondary',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          icon: Shield,
          label: 'Nguy cơ trung bình'
        }
      default:
        return {
          color: 'default',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          label: 'Nguy cơ thấp'
        }
    }
  }

  const getCancerClassificationConfig = (predictedClass: string) => {
    switch (predictedClass) {
      case 'malignant':
        return {
          color: 'destructive',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          icon: AlertTriangle,
          label: 'Ác tính'
        }
      case 'benign':
        return {
          color: 'secondary',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          icon: Shield,
          label: 'Lành tính'
        }
      default:
        return {
          color: 'default',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          label: 'Bình thường'
        }
    }
  }

  return (
    <Card className="bg-neutral-900/60 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group w-full aspect-square flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-white">
          Kết quả chẩn đoán ung thư
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1 flex flex-col">
        {/* Phần 1: Kết quả chẩn đoán theo thông tin bệnh nhân */}
        {patientInfoDiagnosis && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 border-b border-white/10 pb-2">
              Kết quả chẩn đoán theo thông tin
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-neutral-800/40 rounded-lg border border-white/5 hover:bg-neutral-800/60 hover:border-white/10 transition-all duration-300 group/item">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-md group-hover/item:bg-blue-500/30 transition-colors duration-300">
                    <Target className="w-3 h-3 text-blue-400 group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-medium text-white/80 group-hover/item:text-white transition-colors duration-300">Khả năng ung thư</span>
                </div>
                <div className="flex items-center gap-3 w-32 justify-end">
                  <Badge 
                    variant="outline"
                    className={`${getRiskConfig(patientInfoDiagnosis.cancer_probability).bgColor} ${getRiskConfig(patientInfoDiagnosis.cancer_probability).textColor} ${getRiskConfig(patientInfoDiagnosis.cancer_probability).borderColor} text-xs font-semibold hover:scale-105 transition-transform duration-200`}
                  >
                    {getRiskConfig(patientInfoDiagnosis.cancer_probability).label}
                  </Badge>
                  {/* <span className="text-white font-mono text-sm font-bold group-hover/item:scale-110 transition-transform duration-300 min-w-[3.5rem] text-right">
                    {patientInfoDiagnosis.risk_score}%
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phần 2: Kết quả chẩn đoán theo hình ảnh */}
        {imageDiagnosis && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 border-b border-white/10 pb-2">
              Kết quả chẩn đoán theo hình ảnh
            </h3>
            
            <div className="space-y-2">
              {/* UNet - Phát hiện bất thường */}
              {imageDiagnosis.abnormality_detection && (
                <div className="flex items-center justify-between p-3 bg-neutral-800/40 rounded-lg border border-white/5 hover:bg-neutral-800/60 hover:border-white/10 transition-all duration-300 group/item">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${imageDiagnosis.abnormality_detection.has_abnormality ? 'bg-red-500/20 group-hover/item:bg-red-500/30' : 'bg-green-500/20 group-hover/item:bg-green-500/30'} transition-colors duration-300`}>
                      {imageDiagnosis.abnormality_detection.has_abnormality ? (
                        <AlertTriangle className="w-3 h-3 text-red-400 group-hover/item:scale-110 transition-transform duration-300" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-400 group-hover/item:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-white/80 group-hover/item:text-white transition-colors duration-300">Phát hiện bất thường</span>
                  </div>
                  <div className="flex items-center gap-3 w-32 justify-end">
                    <Badge
                      variant={imageDiagnosis.abnormality_detection.has_abnormality ? "destructive" : "default"}
                      className={`${imageDiagnosis.abnormality_detection.has_abnormality ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} text-xs font-semibold hover:scale-105 transition-transform duration-200`}
                    >
                      {imageDiagnosis.abnormality_detection.has_abnormality ? 'Có' : 'Không'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* YOLO - Phân loại ung thư */}
              {imageDiagnosis.cancer_classification && (
                <div className="flex items-center justify-between p-3 bg-neutral-800/40 rounded-lg border border-white/5 hover:bg-neutral-800/60 hover:border-white/10 transition-all duration-300 group/item">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      imageDiagnosis.cancer_classification.predicted_class === 'malignant' ? 'bg-red-500/20 group-hover/item:bg-red-500/30' :
                      imageDiagnosis.cancer_classification.predicted_class === 'benign' ? 'bg-yellow-500/20 group-hover/item:bg-yellow-500/30' : 'bg-green-500/20 group-hover/item:bg-green-500/30'
                    } transition-colors duration-300`}>
                      {imageDiagnosis.cancer_classification.predicted_class === 'malignant' ? (
                        <AlertTriangle className="w-3 h-3 text-red-400 group-hover/item:scale-110 transition-transform duration-300" />
                      ) : imageDiagnosis.cancer_classification.predicted_class === 'benign' ? (
                        <Shield className="w-3 h-3 text-yellow-400 group-hover/item:scale-110 transition-transform duration-300" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-400 group-hover/item:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-white/80 group-hover/item:text-white transition-colors duration-300">Phân loại nguy cơ ung thư</span>
                  </div>
                  <div className="flex items-center gap-3 w-32 justify-end">
                    <Badge
                      variant={imageDiagnosis.cancer_classification.predicted_class === 'malignant' ? "destructive" : imageDiagnosis.cancer_classification.predicted_class === 'benign' ? "secondary" : "default"}
                      className={`text-xs font-semibold hover:scale-105 transition-transform duration-200 ${
                        imageDiagnosis.cancer_classification.predicted_class === 'malignant' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        imageDiagnosis.cancer_classification.predicted_class === 'benign' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}
                    >
                      {getCancerClassificationConfig(imageDiagnosis.cancer_classification.predicted_class).label}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DiagnosisCard


