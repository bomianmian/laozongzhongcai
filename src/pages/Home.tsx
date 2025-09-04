import { useState, useCallback, useRef, useEffect } from 'react';
import { Empty } from '@/components/Empty';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import PreviewModal from '@/components/PreviewModal';
import { motion, AnimatePresence } from 'framer-motion';



type ImageFile = {
  id: string;
  url: string;
  name: string;
  rotation: number;
  scale: number;
};

type Note = {
  id: string;
  text: string;
};

export default function Home() {
  const [title, setTitle] = useState('证据材料');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploadState = () => {
    setImages([]);
    setNotes([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    setImages(prev => {
      // 当只有一张图片时，自动旋转90度并放大1.5倍
      if (images.length === 1) {
        return prev.map(img => ({
          ...img,
          rotation: 90,
          scale: 1.5
        }));
      }
      // 当从单张变为多张时，恢复所有图片的原始状态
      if (prev.some(img => img.rotation !== 0 || img.scale !== 1) && images.length > 1) {
        return prev.map(img => ({
          ...img,
          rotation: 0,
          scale: 1
        }));
      }
      return prev;
    });
  }, [images.length]);
  const navigate = useNavigate();


  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      toast.error('最多只能上传4张图片');
      return;
    }

    const newImages = Array.from(files)
      .filter(file => file.type === 'image/jpeg' || file.type === 'image/png')
      .map(file => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
        name: file.name,
        displayName: file.name.replace(/\.[^/.]+$/, ""), // 去掉文件扩展名
        rotation: 0, // 初始旋转角度为0
        scale: 1 // 初始缩放比例为1
      }));

    if (newImages.length < files.length) {
      toast.error('只能上传JPG/PNG格式图片');
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setNotes(prev => [...prev, ...newImages.map(img => ({
        id: img.id,
        text: img.displayName // 使用文件名作为初始备注
      }))]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange(e.dataTransfer.files);
  }, [images]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const updateNote = (id: string, text: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, text } : note
    ));
  };



  return (
    <div className="flex flex-col min-h-screen p-4 max-w-6xl mx-auto">



      {/* 上传区 - 压缩后的布局 */}
      <div 
        className={cn(
          "border border-dashed border-gray-300 rounded-xl p-2 mb-4",
          "bg-white hover:bg-gray-50 transition-colors shadow-sm",
          "w-full max-w-2xl mx-auto"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-cloud-arrow-up text-lg text-blue-500"></i>
            <div className="text-left">
              <p className="text-gray-600 text-xs">拖拽图片到此处或</p>
              <p className="text-[11px] text-gray-400">支持JPG/PNG格式，最多4张</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs flex items-center shrink-0"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence>
                {images.length > 0 && [1, 2, 3, 4, 5].map(i => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: Math.random() * 60 - 30,
                      y: Math.random() * 60 - 30
                    }}
                    transition={{ 
                      duration: 0.6,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </AnimatePresence>
              <i className="fa-solid fa-upload mr-1 text-[11px]"></i>选择图片
            </motion.button>
            
            <motion.button
              onClick={() => setIsPreviewOpen(true)}
              disabled={images.length === 0}
              className={`px-3 py-1 text-white rounded-lg transition-colors text-sm flex items-center shrink-0 ${
                 images.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
               }`}
               whileTap={{ scale: images.length === 0 ? 1 : 0.95 }}
               style={{ fontSize: '11px' }}
             >
               <AnimatePresence>
                 {images.length > 0 && [1, 2, 3, 4, 5].map(i => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: Math.random() * 60 - 30,
                      y: Math.random() * 60 - 30
                    }}
                    transition={{ 
                      duration: 0.6,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </AnimatePresence>
              <i className="fa-solid fa-check mr-2"></i>完成
            </motion.button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            accept="image/jpeg,image/png"
            multiple
          />
        </div>

        {/* 上传区域不再显示缩略图预览 */}
      </div>


      {/* A4排版区 */}
      <div 
        className="relative bg-white shadow-lg mb-6 mx-auto"
        style={{ 
          width: '297mm',
          height: '210mm',
          overflow: 'hidden',
          padding: '5mm',
          position: 'relative'
        }}
      >
        {/* 页眉区域 - 固定高度 */}
        <div 
          className="text-center absolute top-0 left-0 right-0"
          style={{ 
            height: '15mm',
            padding: '5mm 5mm 0 5mm'
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl text-center focus:outline-none w-full max-w-md mx-auto"
            style={{ fontFamily: 'Microsoft YaHei, SimHei, sans-serif' }}
          />
        </div>

        {/* 图片展示区 - 动态高度 */}
        <div 
          className="absolute left-0 right-0 flex"
          style={{ 
            top: '15mm',
            bottom: '10mm',
            padding: '0 5mm'
          }}
        >
          {images.length > 0 ? (
            images.map((img) => (
              <div 
                key={img.id}
                className="flex flex-col items-center justify-between h-full group"
                style={{ 
                  width: `${100 / images.length}%`,
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
                       <button
                         onClick={() => removeImage(img.id)}
                         className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                         title="删除图片"
                       >
                         <i className="fa-solid fa-xmark"></i>
                       </button>
                  </div>
                {/* 图片备注 */}
                <div className="w-full min-h-[10mm] flex items-center justify-center">
                  <div
                    contentEditable
                    onBlur={(e) => updateNote(img.id, e.currentTarget.textContent || '')}
                    className="w-full text-sm p-1 focus:outline-none text-center"
                    style={{ 
                      fontFamily: 'Microsoft YaHei, SimHei, sans-serif',
                      fontSize: '12pt',
                      color: '#666',
                      minHeight: '10mm'
                    }}
                    suppressContentEditableWarning={true}
                  >
                    {notes.find(n => n.id === img.id)?.text || '添加备注...'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
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
          <input
            type="number"
            min="1"
            value={pageNumber}
            onChange={(e) => setPageNumber(Number(e.target.value))}
            className="w-10 text-center focus:outline-none"
            style={{ fontFamily: 'Microsoft YaHei, SimHei, sans-serif' }}
          />
        </div>
      </div>
  


      {/* 预览模态框 */}
       <PreviewModal
          key={images.map(img => img.id).join('-')} // 添加key确保图片更新时重新渲染
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            resetUploadState();
          }}
          title={title}
          images={images}
          notes={notes}
          pageNumber={pageNumber}
        />
    </div>
  );
}