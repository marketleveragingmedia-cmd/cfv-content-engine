import { PackagePreview } from '@/components/PackagePreview'

export function VisualAssetsTab({ session }: { session: any }) {
  const images = session.assets.filter((a: any) => a.assetType === 'image')
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--green-primary)'}}>Visual Assets</h2>
      </div>
      
      {/* Package Preview */}
      <PackagePreview session={session} />
      
      {/* Image Gallery */}
      <div>
        <h3 className="text-xl font-bold mb-4" style={{color: 'var(--green-primary)'}}>Image Gallery</h3>
      {images.length === 0 ? (
        <div className="text-center py-12" style={{color: 'var(--text-secondary)'}}>
          <p>No visual assets found</p>
          <p className="text-sm mt-2">Images will appear here after import</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image: any) => (
            <div key={image.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {image.filePath ? (
                <a href={`/api/asset/${image.id}?mode=view`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`/api/asset/${image.id}?mode=inline`}
                    alt={image.title}
                    className="aspect-video w-full object-cover rounded mb-2 hover:opacity-90 transition"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center"><span class="text-4xl">🖼️</span></div>';
                      }
                    }}
                  />
                </a>
              ) : (
                <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
              )}
              <p className="text-sm font-semibold mb-2" style={{color: 'var(--text-primary)'}}>
                {image.title}
              </p>
              <div className="flex gap-2 flex-wrap">
                <a 
                  href={`/api/asset/${image.id}?mode=view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-2 py-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded text-xs transition font-semibold"
                >
                  👁️ View
                </a>
                <a 
                  href={`/api/asset/${image.id}?mode=download`}
                  download
                  className="flex-1 text-center px-2 py-1 bg-green-600 text-white hover:bg-green-700 rounded text-xs transition font-semibold"
                >
                  💾 Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
