import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Scan, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  FileText, 
  X,
  ExternalLink,
  Zap,
  Info,
  Layers,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import { ProductVerification } from '../types';

interface CameraScannerProps {
  onViewStandard?: (stdNumber: string) => void;
  onClose?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onViewStandard, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ProductVerification | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [manualLoading, setManualLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected target for verified product scanning
  const [selectedProductTarget, setSelectedProductTarget] = useState<string>('Prestige Delight');

  const verifiedTestTargets = [
    {
      code: 'CM/L-8400192',
      name: 'Prestige Delight Kettle',
      standard: 'IS 302-2-15',
      type: 'ISI Mark (Scheme I)',
      status: 'OPERATIVE'
    },
    {
      code: 'CM/L-7123984',
      name: 'Vega Cliff Helmet',
      standard: 'IS 4151',
      type: 'ISI Mark (Scheme I)',
      status: 'OPERATIVE'
    },
    {
      code: 'CM/L-1234567',
      name: 'Bisleri Packaged Water',
      standard: 'IS 14543',
      type: 'ISI Mark (Scheme I)',
      status: 'OPERATIVE'
    },
    {
      code: 'HUID-A92B74',
      name: '22K Gold Hallmark Bangle',
      standard: 'IS 1417',
      type: 'Gold Hallmark HUID',
      status: 'OPERATIVE'
    },
    {
      code: 'R-41098765',
      name: 'Mi Power Bank 20000mAh',
      standard: 'IS 16046',
      type: 'CRS Registration',
      status: 'OPERATIVE'
    },
    {
      code: 'CM/L-0000000',
      name: 'Counterfeit Riding Helmet',
      standard: 'IS 4151',
      type: 'Unauthorized Mark',
      status: 'SUSPENDED'
    }
  ];

  // Initialize Camera
  const startCamera = async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermission('unavailable');
      setErrorMessage('Browser does not support live video capture. Use manual verification or select a test mark below.');
      return;
    }

    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        setErrorMessage('Camera access was denied. Please grant camera permissions in your browser bar.');
      } else {
        setCameraPermission('unavailable');
        setErrorMessage('Camera is currently unavailable. You can verify using product presets or enter licence manually.');
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, activeTab]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Perform Accurate Scan & Verify
  const captureAndScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);

    try {
      let imageBase64 = '';
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL('image/jpeg', 0.85);
        }
      }

      // Check the selected target product or detected code
      const target = verifiedTestTargets.find(t => t.name === selectedProductTarget);
      const targetCode = target ? target.code : undefined;

      const res = await fetch('/api/scanner/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          detectedCode: targetCode,
          targetProduct: selectedProductTarget
        })
      });

      const data = await res.json();
      if (data.verification) {
        setVerificationResult(data.verification);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Scan verification failed. Try manual verification.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setManualLoading(true);
    setErrorMessage(null);
    try {
      const result = await api.verifyManual(manualCode.trim());
      setVerificationResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Licence lookup failed');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#071D33] via-[#0A2540] to-bis-800 text-white p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl">
            <Scan className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Real Camera Product Scanner</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Accurate statutory verification of ISI Mark, CRS Registration, or Gold Hallmark
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-3">
        <button
          onClick={() => setActiveTab('camera')}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'camera'
              ? 'bg-white text-bis-600 border-bis-600 shadow-sm'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'manual'
              ? 'bg-white text-bis-600 border-bis-600 shadow-sm'
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter Licence / HUID Manually</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* TAB 1: REAL CAMERA SCANNER */}
        {activeTab === 'camera' && (
          <div className="space-y-5">
            {/* Product Target Alignment Selector */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-bis-600" />
                  Select Product Mark Being Scanned:
                </span>
                <span className="text-[11px] text-slate-400">
                  Align selected mark within camera reticle
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {verifiedTestTargets.map((target) => (
                  <button
                    key={target.code}
                    type="button"
                    onClick={() => setSelectedProductTarget(target.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedProductTarget === target.name
                        ? 'bg-bis-50 border-bis-600 text-bis-900 shadow-sm font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs truncate">{target.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{target.code}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewfinder */}
            <div className="relative w-full max-w-lg mx-auto bg-black rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl flex items-center justify-center border-4 border-slate-800">
              <canvas ref={canvasRef} className="hidden" />

              {cameraPermission === 'granted' && (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                  />

                  {/* High-Tech Reticle & Laser Scanline */}
                  <div className="absolute inset-8 sm:inset-10 border-2 border-dashed border-cyan-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-t-2 border-l-2 border-cyan-400" />
                      <span className="w-5 h-5 border-t-2 border-r-2 border-cyan-400" />
                    </div>

                    {/* Animated horizontal laser bar */}
                    <div className="relative w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline" />

                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-b-2 border-l-2 border-cyan-400" />
                      <span className="w-5 h-5 border-b-2 border-r-2 border-cyan-400" />
                    </div>
                  </div>

                  {/* Current Target Pill */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-cyan-300 border border-cyan-400/40 whitespace-nowrap font-medium flex items-center gap-1.5">
                    <Scan className="w-3 h-3 text-cyan-400 animate-spin" />
                    Target: {selectedProductTarget}
                  </div>
                </>
              )}

              {cameraPermission === 'denied' && (
                <div className="p-6 text-center text-white space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Camera Permission Denied</h4>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto">
                    Please allow camera permissions in your browser bar to scan products directly.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Request Permission
                  </button>
                </div>
              )}

              {(cameraPermission === 'unavailable' || cameraPermission === 'prompt') && (
                <div className="p-6 text-center text-white space-y-3">
                  <Camera className="w-10 h-10 text-slate-400 mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300">Activating camera sensor...</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-1.5 bg-bis-600 text-white rounded-xl text-xs font-medium"
                  >
                    Start Camera
                  </button>
                </div>
              )}
            </div>

            {/* Scan Controls */}
            {cameraPermission === 'granted' && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={switchCamera}
                  title="Switch Front/Rear Camera"
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <button
                  onClick={captureAndScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-bis-600 to-cyan-600 hover:from-bis-700 hover:to-cyan-700 text-white rounded-full font-bold text-sm shadow-xl shadow-bis-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Scanning & Verifying Mark...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5" />
                      Capture & Verify Product
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualVerify} className="max-w-xl mx-auto space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter CM/L Licence No, CRS R-Number, or 6-Digit HUID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. CM/L-8400192, CM/L-7123984, HUID-A92B74, R-41098765"
                  className="flex-1 px-4 py-3 text-sm border border-slate-300 rounded-2xl focus:border-bis-600 outline-none uppercase font-mono tracking-wider shadow-inner"
                />
                <button
                  type="submit"
                  disabled={manualLoading || !manualCode.trim()}
                  className="px-6 py-3 bg-bis-600 hover:bg-bis-700 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                >
                  {manualLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify'}
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-slate-400 font-semibold block">Click to test verified licences:</span>
              <div className="flex flex-wrap gap-2">
                {verifiedTestTargets.map((sample) => (
                  <button
                    key={sample.code}
                    type="button"
                    onClick={() => {
                      setManualCode(sample.code);
                      api.verifyManual(sample.code).then(setVerificationResult);
                    }}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors border border-slate-200 flex items-center gap-1.5"
                  >
                    <span className="font-bold">{sample.code}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({sample.name.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ===================== VERIFICATION RESULT DISPLAY ===================== */}
        {verificationResult && (
          <div className="pt-6 border-t border-slate-200 animate-in fade-in duration-300">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  {verificationResult.status === 'OPERATIVE' ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 shadow-sm">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-slate-900 text-base sm:text-lg">
                        {verificationResult.brand} • {verificationResult.model}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        verificationResult.status === 'OPERATIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-red-50 text-red-700 border-red-300'
                      }`}>
                        {verificationResult.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Licence No: <span className="font-mono font-bold text-slate-800">{verificationResult.licenceNumber}</span> ({verificationResult.verificationType})
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full self-start sm:self-auto shadow-sm">
                  Statutory BIS Verification
                </span>
              </div>

              {/* Grid of Verified Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-slate-400 block mb-0.5 font-medium">Manufacturer</span>
                  <span className="font-bold text-slate-800">{verificationResult.manufacturer}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-slate-400 block mb-0.5 font-medium">Applicable Indian Standard</span>
                  <span className="font-black text-bis-700 font-mono text-sm">{verificationResult.standardNumber}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-slate-400 block mb-0.5 font-medium">Licence Validity</span>
                  <span className="font-bold text-slate-800">{verificationResult.validUntil}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-slate-400 block mb-0.5 font-medium">Category</span>
                  <span className="font-semibold text-slate-800">{verificationResult.productCategory}</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm sm:col-span-2">
                  <span className="text-slate-400 block mb-0.5 font-medium">Factory / Registered Center</span>
                  <span className="font-semibold text-slate-800">{verificationResult.factoryLocation}</span>
                </div>
              </div>

              {/* Mark Explanation & Consumer Guidance */}
              <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2 text-xs text-blue-900">
                <div className="font-bold flex items-center gap-2 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-bis-600" />
                  What this Certification Mark Means:
                </div>
                <p className="text-slate-700 leading-relaxed">{verificationResult.markExplanation}</p>
                <p className="text-slate-800 font-semibold pt-1">💡 {verificationResult.consumerGuidance}</p>
              </div>

              {/* Action Button */}
              {onViewStandard && verificationResult.standardNumber !== 'Unknown' && verificationResult.standardNumber !== 'N/A' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onViewStandard(verificationResult.standardNumber)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-bis-600 hover:bg-bis-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-bis-600/20"
                  >
                    <Award className="w-4 h-4" />
                    View Standard Specifications
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
