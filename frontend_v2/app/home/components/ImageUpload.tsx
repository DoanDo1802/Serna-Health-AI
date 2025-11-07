"use client"

export interface ImageUploadProps {
  imageUrl: string | null
  onPick: () => void
}

export function ImageUpload({ imageUrl, onPick }: ImageUploadProps) {
  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="w-full aspect-square max-h-[640px]">
        <div
          className="relative w-full h-full rounded-xl border border-white/10 bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={onPick}
          aria-label="Upload image"
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="uploaded" className="absolute inset-0 w-full h-full object-contain" />
          ) : (
            <div className="text-center p-6">
              <div className="text-sm text-white/70">Click to upload image</div>
              <div className="text-xs text-white/40 mt-1">PNG or JPG up to ~10MB</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageUpload


