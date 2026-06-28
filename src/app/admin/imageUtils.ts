// Client-side image downscale + compress so the repo doesn't bloat.
// Returns a JPEG data URL (max ~1400px on the long edge).
export function resizeImage(file: File, maxEdge = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxEdge) {
          height = Math.round((height * maxEdge) / width)
          width = maxEdge
        } else if (height >= width && height > maxEdge) {
          width = Math.round((width * maxEdge) / height)
          height = maxEdge
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
