import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: {
    id: string;
    url: string;
    name: string;
  }[];
   notes: {
    id: string;
    text: string;
  }[];
  pageNumber: number;
};

export default function PreviewModal({ isOpen, onClose, title, images, notes, pageNumber }: PreviewModalProps) {
  const [scale, setScale] = useState(1);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      generateScreenshot();
    } else {
      setScreenshotUrl(null);
      setIsGenerating(false);
    }
  }, [isOpen, images]); // 添加images作为依赖

  const generateScreenshot = async () => {
    if (!previewRef.current) return;
    
    // 更可靠的图片加载检测
    const images = previewRef.current.querySelectorAll('img');
    let allLoaded = true;
    
    // 先检查是否有图片加载失败
    for (const img of Array.from(images)) {
      if (img.complete && img.naturalHeight === 0) {
        allLoaded = false;
        break;
      }
    }

    if (!allLoaded) {
      toast.error('部分图片加载失败，请检查后重试');
      return;
    }

    // 等待所有图片加载完成
    const loadedPromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => {
          toast.error('图片加载失败，请检查图片文件');
          resolve();
        };
      });
    });

    setIsGenerating(true);
    try {
      await Promise.all(loadedPromises);
      const dataUrl = await toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: 'white',
        includeQuerySelectors: ['.absolute']
      });
      setScreenshotUrl(dataUrl);
      // 只有真正成功时才不显示错误
    } catch (error) {
      console.error('生成截图失败:', error);
      if (!screenshotUrl) {
        toast.error('生成预览失败，请重试');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-full max-h-full overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 控制栏 */}

        <div className="sticky top-0 bg-white p-2 flex justify-between items-center border-b z-10">
          <div className="flex space-x-2">
            <button 
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <i className="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <span className="px-2">{Math.round(scale * 100)}%</span>
            <button 
              onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (screenshotUrl) {
                  const a = document.createElement('a');
                  a.href = screenshotUrl;
                  a.download = `证据材料-${new Date().toISOString().slice(0, 10)}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }
              }}
              disabled={!screenshotUrl}
              className={`px-3 py-1 ${screenshotUrl ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white rounded`}
            >
              <i className="fa-solid fa-download mr-1"></i> 下载
            </button>
            <button 
              onClick={() => {
                if (screenshotUrl) {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>打印预览</title>
                          <style>
                            @page { size: auto; margin: 0mm; }
                            body { margin: 0; padding: 0; }
                            img { width: 100%; height: auto; }
                          </style>
                        </head>
                        <body>
                          <img src="${screenshotUrl}" />
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                    }, 500);
                  }
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <i className="fa-solid fa-print mr-1"></i> 打印
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <i className="fa-solid fa-xmark"></i> 关闭
            </button>
          </div>
        </div>


        {/* 预览内容 */}
        <div 
          className="p-4"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center w-[297mm] h-[210mm]">
              <div className="animate-spin text-blue-500">
                <i className="fa-solid fa-spinner text-4xl"></i>
              </div>
            </div>
          ) : screenshotUrl ? (
            <img
              src={screenshotUrl}
              alt="预览截图"
              className="w-[297mm] h-[210mm] object-contain"
            />
          ) : (
            <div 
              ref={previewRef}
              className="bg-white relative"
              style={{ 
                width: '297mm',
                height: '210mm',
                padding: '5mm',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* 页眉区域 - 固定高度 */}
              <div className="text-center mb-2" style={{ height: '15mm' }}>
                <div className="text-xl text-center w-full max-w-md mx-auto">
                  {title}
                </div>
              </div>

              {/* 图片展示区 - 动态高度 */}
              <div className="flex flex-1" style={{ 
                minHeight: 'calc(100% - 45mm)',
                alignItems: 'center'
              }}>
                {images.map((img) => (
                  <div 
                    key={img.id}
                    className="flex flex-col items-center justify-between"
                    style={{ 
                      width: `${100 / images.length}%`,
                      height: '100%',
                      padding: '0 10px'
                    }}
                  >
                     <div className="relative w-full h-[calc(100%-10mm)] flex items-center justify-center">
                            <img
                              src={img.url}
                              alt={img.name}
                              className="object-contain"
                              style={{ 
                                height: img.rotation % 180 === 0 ? '100%' : 'auto',
                                width: img.rotation % 180 === 0 ? 'auto' : '100%',
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                transform: `rotate(${img.rotation}deg) scale(${img.scale})`,
                                transition: 'transform 0.3s ease',
                                transformOrigin: 'center'
                              }}
                            />
                    </div>
                     {/* 图片备注 */}
                      <div className="w-full mt-2 px-2 min-h-[10mm] flex items-center justify-center">
                       <div className="w-full text-sm p-1 text-center">
                         {notes.find(n => n.id === img.id)?.text || ''}
                       </div>
                     </div>
                  </div>
                ))}
              </div>

               {/* 页脚区域 - 固定高度 */}
                 <div 
                   className="absolute bottom-0 left-0 right-0 text-sm flex items-center justify-end pr-4"
                   style={{ 
                     height: '10mm',
                     paddingBottom: '5mm'
                   }}
                 >
                   <span className="mr-1">P</span>
                   <span>{pageNumber}</span>
                 </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}