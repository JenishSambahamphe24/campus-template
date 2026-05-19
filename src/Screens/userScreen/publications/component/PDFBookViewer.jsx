import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiGrid, 
  FiZoomIn, 
  FiZoomOut, 
  FiMaximize2, 
  FiMinimize2, 
  FiDownload, 
  FiShare2, 
  FiMoreHorizontal,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { downloadPublicationFile } from '../../../cmsScreen/cms-components/cms-publication/publicationApi';

// Thumbnail renderer for on-demand page preview rendering in the sidebar drawer
function MiniPageRenderer({ pdfDoc, pageNum, onClick, isActive }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfDoc) return;
    let renderTask = null;
    let isMounted = true;

    const renderMini = async () => {
      try {
        setLoading(true);
        const page = await pdfDoc.getPage(pageNum);
        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const scale = 120 / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;
        if (isMounted) setLoading(false);
      } catch (err) {
        if (err.name !== 'RenderingCancelledException' && isMounted) {
          console.error("Mini render error:", err);
        }
      }
    };

    renderMini();

    return () => {
      isMounted = false;
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, pageNum]);

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer group flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600/20 ring-2 ring-blue-500/80 shadow-md shadow-blue-500/5' 
          : 'bg-neutral-800 hover:bg-neutral-700'
      }`}
    >
      <div className="relative shadow-md overflow-hidden bg-white rounded w-[210px] aspect-[1/1.4] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {loading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
            <span className="text-[10px] text-neutral-400 font-semibold">Page {pageNum}</span>
          </div>
        )}
        <canvas ref={canvasRef} className={`max-w-full max-h-full object-contain ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`} />
      </div>
      <span className="text-[10px] text-neutral-400 mt-1.5 font-medium transition-colors duration-200 group-hover:text-neutral-200">Page {pageNum}</span>
    </div>
  );
}

export default function PDFBookViewer({ file, title }) {
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isBookView, setIsBookView] = useState(true);
  
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const singleCanvasRef = useRef(null);

  const leftRenderTask = useRef(null);
  const rightRenderTask = useRef(null);
  const singleRenderTask = useRef(null);

  // 1. Detect screen size changes for responsive views
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsBookView(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // In book layout, displayed bottom page number corresponds to the right-hand page (e.g. page 3 when showing pages 2 & 3 side-by-side)
  const showSingleCentered = !isBookView || currentPage === 1;
  const displayedPage = showSingleCentered 
    ? currentPage 
    : (currentPage + 1 <= numPages ? currentPage + 1 : currentPage);

  // Sync the page text input with current displayed page state
  useEffect(() => {
    setPageInput(displayedPage.toString());
  }, [displayedPage]);

  // 2. Load PDF.js dynamically from unpkg/cdnjs CDN
  useEffect(() => {
    let active = true;
    const initPdfJs = async () => {
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }
        if (active) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
          setPdfLibLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load PDFJS script:", err);
        if (active) setError("Could not load PDF rendering engine. Please refresh or try again.");
      }
    };
    initPdfJs();
    return () => { active = false; };
  }, []);

  // 3. Fetch PDF binary via Axios (to track progress) and feed it as Uint8Array to PDF.js
  useEffect(() => {
    if (!pdfLibLoaded || !file) return;
    let active = true;

    const fetchPdf = async () => {
      try {
        setLoading(true);
        setLoadingProgress(0);
        setError(null);

        const fileUrl = `${import.meta.env.VITE_FILE_URL}/content/${file}`;

        const response = await axios.get(fileUrl, {
          responseType: 'arraybuffer',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              if (active) setLoadingProgress(percent);
            } else {
              if (active) setLoadingProgress(50);
            }
          }
        });

        if (!active) return;

        const docData = new Uint8Array(response.data);
        const doc = await window.pdfjsLib.getDocument({ data: docData }).promise;

        if (active) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
          
          setTimeout(() => {
            if (active) handleZoomToFit(doc);
          }, 150);
        }
      } catch (err) {
        console.error("Error reading PDF:", err);
        if (active) {
          setError("Notice PDF file is currently unavailable. You can click the button below to download the file directly.");
          setLoading(false);
        }
      }
    };

    fetchPdf();
    return () => { active = false; };
  }, [pdfLibLoaded, file]);

  // 4. Render PDF page onto high-resolution Canvas elements
  useEffect(() => {
    if (!pdfDoc || loading) return;

    const renderPages = async () => {
      try {
        if (!showSingleCentered) {
          const leftPageNum = currentPage;
          const rightPageNum = currentPage + 1 <= numPages ? currentPage + 1 : null;

          // Render Left Page
          if (leftPageNum && leftCanvasRef.current) {
            if (leftRenderTask.current) leftRenderTask.current.cancel();
            const page = await pdfDoc.getPage(leftPageNum);
            const canvas = leftCanvasRef.current;
            const viewport = page.getViewport({ scale });
            const context = canvas.getContext('2d');

            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            context.scale(ratio, ratio);

            leftRenderTask.current = page.render({ canvasContext: context, viewport });
            await leftRenderTask.current.promise;
          }

          // Render Right Page
          if (rightCanvasRef.current) {
            if (rightRenderTask.current) rightRenderTask.current.cancel();
            
            if (rightPageNum) {
              const page = await pdfDoc.getPage(rightPageNum);
              const canvas = rightCanvasRef.current;
              const viewport = page.getViewport({ scale });
              const context = canvas.getContext('2d');

              const ratio = window.devicePixelRatio || 1;
              canvas.width = Math.floor(viewport.width * ratio);
              canvas.height = Math.floor(viewport.height * ratio);
              canvas.style.width = `${viewport.width}px`;
              canvas.style.height = `${viewport.height}px`;
              context.scale(ratio, ratio);

              rightRenderTask.current = page.render({ canvasContext: context, viewport });
              await rightRenderTask.current.promise;
            } else {
              const canvas = rightCanvasRef.current;
              const context = canvas.getContext('2d');
              context.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        } else {
          // Single Centered Page View: currentPage
          if (singleCanvasRef.current) {
            if (singleRenderTask.current) singleRenderTask.current.cancel();
            const page = await pdfDoc.getPage(currentPage);
            const canvas = singleCanvasRef.current;
            const viewport = page.getViewport({ scale });
            const context = canvas.getContext('2d');

            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * ratio);
            canvas.height = Math.floor(viewport.height * ratio);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            context.scale(ratio, ratio);

            singleRenderTask.current = page.render({ canvasContext: context, viewport });
            await singleRenderTask.current.promise;
          }
        }
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error("Render error:", err);
        }
      }
    };

    renderPages();

    return () => {
      if (leftRenderTask.current) leftRenderTask.current.cancel();
      if (rightRenderTask.current) rightRenderTask.current.cancel();
      if (singleRenderTask.current) singleRenderTask.current.cancel();
    };
  }, [pdfDoc, currentPage, scale, isBookView, showSingleCentered, numPages, loading]);

  // Sync full screen states
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // 5. Navigation Control functions
  const goToPage = (pageNum) => {
    const page = Math.max(1, Math.min(numPages, pageNum));
    if (isBookView && page > 1) {
      const targetPage = page % 2 === 0 ? page : page - 1;
      setCurrentPage(targetPage);
    } else {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (showSingleCentered) {
      if (currentPage < numPages) {
        if (isBookView && currentPage === 1) {
          goToPage(2);
        } else {
          goToPage(currentPage + 1);
        }
      }
    } else {
      if (currentPage + 2 <= numPages) {
        goToPage(currentPage + 2);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage === 1) return;
    if (isBookView) {
      if (currentPage === 2) {
        goToPage(1);
      } else {
        goToPage(currentPage - 2);
      }
    } else {
      goToPage(currentPage - 1);
    }
  };

  // 6. Zoom & Layout control functions (capping up to 10.0 for small coordinate system PDF support)
  const handleZoomIn = () => setScale(prev => Math.min(10.0, prev + 0.15));
  const handleZoomOut = () => setScale(prev => Math.max(0.4, prev - 0.15));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale(prev => Math.min(10.0, prev + 0.15));
      } else {
        setScale(prev => Math.max(0.4, prev - 0.15));
      }
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);
  
  const handleZoomToFit = async (customDoc = null) => {
    const doc = customDoc || pdfDoc;
    if (!doc || !containerRef.current) return;
    
    try {
      const page = await doc.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.0 });
      
      const availWidth = containerRef.current.clientWidth - 24; 
      const availHeight = containerRef.current.clientHeight - 24;

      const scaleWidth = (availWidth / (showSingleCentered ? 1 : 2)) / viewport.width;
      const scaleHeight = availHeight / viewport.height;
      
      const newScale = Math.min(scaleWidth, scaleHeight) * 0.99;
      setScale(Math.max(0.4, Math.min(10.0, newScale)));
    } catch (err) {
      console.error("Zoom fit calculation failed:", err);
    }
  };

  const toggleLayout = () => {
    if (isMobile) return;
    const nextLayout = !isBookView;
    setIsBookView(nextLayout);
    
    if (nextLayout && currentPage > 1 && currentPage % 2 !== 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen?.() || 
      viewerRef.current.webkitRequestFullscreen?.() || 
      viewerRef.current.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(pageInput, 10);
    if (!isNaN(val)) {
      goToPage(val);
    } else {
      setPageInput(displayedPage.toString());
    }
  };

  return (
    <div 
      ref={viewerRef} 
      className={`relative w-full h-[88vh] rounded-xl flex flex-col items-center justify-between overflow-hidden shadow-xl transition-colors duration-500 bg-[#7a7a7a]`}
    >
      {/* 1. Main display workspace containing Pages and Previews Sidebar */}
      <div className="relative flex-grow w-full flex overflow-hidden">
        
        {/* Hover-only absolute thin chevrons navigation */}
        {!loading && !error && (
          <>
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 hover:scale-105 active:scale-90 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 z-20"
              title="Previous Page"
            >
              <FiChevronLeft size={60} strokeWidth={1} />
            </button>
            <button 
              onClick={handleNext}
              disabled={showSingleCentered ? currentPage >= numPages : currentPage + 1 >= numPages}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 hover:scale-105 active:scale-90 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 z-20"
              title="Next Page"
            >
              <FiChevronRight size={60} strokeWidth={1} />
            </button>
          </>
        )}

        {/* Page Previews Sidebar drawer */}
        <AnimatePresence>
          {showThumbnails && !loading && !error && (
            <motion.div 
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute lg:relative left-0 top-0 bottom-0 w-[250px] bg-neutral-900/90 backdrop-blur-md border-r border-neutral-800 z-30 flex flex-col p-4 shadow-3xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <span className="text-[11px] font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
                  <FiGrid className="text-blue-500" /> Page Previews
                </span>
                <button 
                  onClick={() => setShowThumbnails(false)} 
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 p-1.5 rounded-lg transition-all"
                >
                  <FiX size={16} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto grid grid-cols-2 gap-3 pr-1 scrollbar-thin">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                  <MiniPageRenderer 
                    key={pageNum}
                    pdfDoc={pdfDoc}
                    pageNum={pageNum}
                    isActive={
                      showSingleCentered 
                        ? currentPage === pageNum 
                        : (currentPage === pageNum || currentPage + 1 === pageNum)
                    }
                    onClick={() => {
                      goToPage(pageNum);
                      if (isMobile) setShowThumbnails(false);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central HTML5 Canvas Area (Permanently Mounted key to solve Framer Motion race condition) */}
        <div 
          ref={containerRef} 
          onMouseDown={(e) => {
            if (!containerRef.current) return;
            setIsDragging(true);
            setDragStart({
              x: e.pageX - containerRef.current.offsetLeft,
              y: e.pageY - containerRef.current.offsetTop,
              scrollLeft: containerRef.current.scrollLeft,
              scrollTop: containerRef.current.scrollTop
            });
          }}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (!isDragging || !containerRef.current) return;
            e.preventDefault();
            const x = e.pageX - containerRef.current.offsetLeft;
            const y = e.pageY - containerRef.current.offsetTop;
            containerRef.current.scrollLeft = dragStart.scrollLeft - (x - dragStart.x);
            containerRef.current.scrollTop = dragStart.scrollTop - (y - dragStart.y);
          }}
          className={`flex-grow h-full p-2 overflow-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <div className="min-h-full min-w-full flex flex-col items-center justify-center w-max h-max m-auto">
          {loading && (
            <div className="flex flex-col items-center gap-3.5 text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-2xl">
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-[3px] border-black/10 border-t-white animate-spin"></div>
                <span className="absolute text-[10px] font-bold text-white">{loadingProgress}%</span>
              </div>
              <div>
                <p className="text-white font-semibold text-xs tracking-wide">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-md bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-red-200 text-center shadow-2xl">
              <FiAlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <h5 className="text-slate-800 font-bold text-sm mb-1.5">Notice Loading Failed</h5>
              <p className="text-slate-500 text-xs leading-relaxed mb-5">{error}</p>
              <button 
                onClick={() => downloadPublicationFile(file)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all"
              >
                <FiDownload size={14} /> Download File Directly
              </button>
            </div>
          )}

          {!loading && !error && (
            <motion.div 
              key="pdf-viewer-content-permanently-mounted"
              initial={{ opacity: 0.9, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center w-full h-full"
            >
              {showSingleCentered ? (
                /* Cover Page Single Layout */
                <div className="relative shadow-2xl rounded-sm bg-white overflow-hidden flex-shrink-0 select-none border border-black/5">
                  <canvas ref={singleCanvasRef} className="block pointer-events-none" />
                  {isBookView && currentPage === 1 && (
                    <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/8 to-transparent pointer-events-none z-10" />
                  )}
                </div>
              ) : (
                /* Opened Book Side-by-Side double layout */
                <div className="relative flex shadow-2xl rounded-sm bg-white overflow-hidden flex-shrink-0 select-none border border-neutral-300">
                  
                  {/* Left Page canvas sheet */}
                  <div className="relative bg-white flex-shrink-0 select-none">
                    <canvas ref={leftCanvasRef} className="block pointer-events-none" />
                    <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Spinal crease */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10 z-10 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/8 via-black/15 to-black/8 z-10 pointer-events-none" />

                  {/* Right Page canvas sheet */}
                  <div className="relative bg-white flex-shrink-0 select-none">
                    <canvas ref={rightCanvasRef} className="block pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
          </div>
        </div>
      </div>

      {/* 2. White pill control bar */}
      {!loading && !error && (
        <div className="w-full flex justify-center pb-5 px-6 bg-transparent z-20">
          <div className="flex items-center h-[42px] bg-white border border-slate-200/90 rounded-lg shadow-xl px-1">
            
            {/* Prev button */}
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all"
              title="Previous Page"
            >
              <FiChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* Separator */}
            <div className="h-5 w-[1px] bg-slate-200 self-center"></div>

            {/* Page number input */}
            <form onSubmit={handlePageSubmit} className="flex items-center justify-center px-3 min-w-[55px] h-full text-slate-700 font-medium text-sm">
              <input 
                type="text" 
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => setPageInput(displayedPage.toString())}
                className="w-7 text-center bg-transparent border-none outline-none font-bold text-slate-800 text-xs focus:ring-0 p-0"
              />
              <span className="text-slate-400 select-none mx-0.5">/</span>
              <span className="text-slate-500 font-semibold select-none text-xs">{numPages}</span>
            </form>

            {/* Separator */}
            <div className="h-5 w-[1px] bg-slate-200 self-center"></div>

            {/* Next button */}
            <button 
              onClick={handleNext}
              disabled={showSingleCentered ? currentPage >= numPages : currentPage + 1 >= numPages}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-20 disabled:pointer-events-none active:scale-95 transition-all"
              title="Next Page"
            >
              <FiChevronRight size={16} strokeWidth={2} />
            </button>

            {/* Separator */}
            <div className="h-5 w-[1px] bg-slate-200 self-center"></div>

            {/* Sidebar toggle */}
            <button 
              onClick={() => setShowThumbnails(prev => !prev)}
              className={`px-3 h-full flex items-center justify-center transition-all ${
                showThumbnails ? 'text-blue-500 bg-blue-50/50' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Pages Previews"
            >
              <FiGrid size={15} strokeWidth={2} />
            </button>

            {/* Zoom In */}
            <button 
              onClick={handleZoomIn}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="Zoom In"
            >
              <FiZoomIn size={15} strokeWidth={2} />
            </button>

            {/* Zoom Out */}
            <button 
              onClick={handleZoomOut}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="Zoom Out"
            >
              <FiZoomOut size={15} strokeWidth={2} />
            </button>

            {/* Fullscreen fit */}
            <button 
              onClick={toggleFullscreen}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <FiMinimize2 size={15} strokeWidth={2} /> : <FiMaximize2 size={15} strokeWidth={2} />}
            </button>

            {/* Download */}
            <button 
              onClick={() => downloadPublicationFile(file)}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="Download Notice PDF"
            >
              <FiDownload size={15} strokeWidth={2} />
            </button>

            {/* Share */}
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title || 'Notice Document',
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="px-3 h-full flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="Share Link"
            >
              <FiShare2 size={15} strokeWidth={2} />
            </button>

            {/* Layout Toggle */}
            <button 
              onClick={toggleLayout}
              className={`px-3 h-full flex items-center justify-center transition-all ${
                isBookView ? 'text-blue-500 bg-blue-50/50' : 'text-slate-500 hover:text-slate-800'
              }`}
              disabled={isMobile}
              title={isBookView ? "Switch to Single Page Layout" : "Switch to Double Book Layout"}
            >
              <FiMoreHorizontal size={15} strokeWidth={2} />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
