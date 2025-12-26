import { useState } from 'react'
import { Upload, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export default function AppSettings() {
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const { showToast } = useToast()

    const handleFileChange = (file: File | null) => {
        if (!file) return

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
        if (!validTypes.includes(file.type)) {
            showToast('error', 'Invalid file type. Please upload PNG, JPG, or SVG.')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('error', 'File size too large. Maximum size is 5MB.')
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleFileChange(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleUpload = () => {
        if (previewImage) {
            setCurrentImage(previewImage)
            setPreviewImage(null)
            showToast('success', 'Application image updated successfully!')
        }
    }

    const handleReplace = () => {
        setCurrentImage(null)
        setPreviewImage(null)
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Application Branding</h1>
                <p className="text-muted-foreground">Manage your application's visual identity and branding assets</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-6">
                {/* Current Image Section */}
                {currentImage && (
                    <div className="mb-6 pb-6 border-b border-border">
                        <h2 className="text-lg font-semibold mb-4">Current Application Image</h2>
                        <div className="flex items-start gap-6">
                            <div className="w-48 h-48 border-2 border-border rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                                <img
                                    src={currentImage}
                                    alt="Current app logo"
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-4">
                                    This image represents your application across the platform.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={handleReplace}
                                >
                                    Replace Image
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                {!currentImage && (
                    <>
                        <h2 className="text-lg font-semibold mb-4">
                            {previewImage ? 'Preview & Upload' : 'Upload Application Image'}
                        </h2>

                        {/* Drag and Drop Zone */}
                        {!previewImage && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200",
                                    isDragging
                                        ? "border-primary bg-primary/5 scale-[1.02]"
                                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                                )}
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium mb-1">
                                            Drag and drop your image here
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            or click to browse files
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.svg"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button asChild>
                                            <span>Browse Files</span>
                                        </Button>
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Supported formats: PNG, JPG, SVG • Maximum size: 5MB
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Preview Section */}
                        {previewImage && (
                            <div className="space-y-4">
                                <div className="border-2 border-border rounded-lg p-8 bg-muted/30">
                                    <div className="flex items-center justify-center">
                                        <div className="w-64 h-64 border border-border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPreviewImage(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpload}
                                        className="gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Upload Image
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Info Section */}
                <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold mb-2">Image Guidelines</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Use a square image for best results (recommended: 512x512px or larger)</li>
                        <li>• Ensure your logo is clearly visible on both light and dark backgrounds</li>
                        <li>• SVG format is recommended for scalability</li>
                        <li>• PNG format with transparent background works best for logos</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
