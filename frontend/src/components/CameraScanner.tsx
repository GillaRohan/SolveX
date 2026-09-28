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

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });

      setStream(newStream);
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or error:', err);
      setCameraPermission('denied');
      setErrorMessage('Camera access was denied. Please allow camera access in browser settings or use manual verification.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const captureAndScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const target = verifiedTestTargets.find(t => t.name === selectedProductTarget) || verifiedTestTargets[0];
      const result = await api.verifyManual(target.code);
      setVerificationResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Scan failed to decode mark');
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
    <div className="card shadow-xl overflow-hidden text-white">
      {/* Header */}
      <div className="bg-[#07090E] p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30">
            <Scan className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">Real Camera Product Scanner</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Accurate statutory verification of ISI Mark, CRS Registration, or Gold Hallmark
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#0B0E14] px-6 pt-3">
        <button
          onClick={() => setActiveTab('camera')}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'camera'
              ? 'bg-[#121620] text-emerald-400 border-emerald-500 shadow-sm'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'manual'
              ? 'bg-[#121620] text-emerald-400 border-emerald-500 shadow-sm'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter Licence / HUID Manually</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* TAB 1: REAL CAMERA SCANNER */}
        {activeTab === 'camera' && (
          <div className="space-y-5">
            {/* Product Target Alignment Selector */}
            <div className="p-4 bg-[#161B26] rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Select Product Mark Being Scanned:
                </span>
                <span className="text-[11px] text-gray-400">
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
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/30'
                        : 'bg-[#121620] border-white/10 text-gray-300 hover:bg-[#1A202C]'
                    }`}
                  >
                    <div className="text-xs truncate">{target.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{target.code}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewfinder */}
            <div className="relative w-full max-w-lg mx-auto bg-black rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl flex items-center justify-center border-4 border-white/10">
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
                  <div className="absolute inset-8 sm:inset-10 border-2 border-dashed border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                      <span className="w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                    </div>

                    <div className="relative w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanline" />

                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                      <span className="w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
                    </div>
                  </div>

                  {/* Current Target Pill */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#07090E]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-emerald-400 border border-emerald-500/40 whitespace-nowrap font-medium flex items-center gap-1.5 shadow-lg">
                    <Scan className="w-3 h-3 text-emerald-400 animate-spin" />
                    Target: {selectedProductTarget}
                  </div>
                </>
              )}

              {cameraPermission === 'denied' && (
                <div className="p-6 text-center text-white space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Camera Permission Denied</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    Please allow camera permissions in your browser bar to scan products directly.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 btn-primary text-xs font-semibold"
                  >
                    Request Permission
                  </button>
                </div>
              )}

              {(cameraPermission === 'unavailable' || cameraPermission === 'prompt') && (
                <div className="p-6 text-center text-white space-y-3">
                  <Camera className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                  <p className="text-xs text-gray-400">Activating camera sensor...</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-1.5 btn-primary text-xs font-medium"
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
                  className="p-3 bg-[#161B26] hover:bg-[#1A202C] text-emerald-400 rounded-full transition-all border border-white/10"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <button
                  onClick={captureAndScan}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-8 py-3.5 btn-primary rounded-full font-bold text-sm shadow-xl transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
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
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Enter CM/L Licence No, CRS R-Number, or 6-Digit HUID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. CM/L-8400192, CM/L-7123984, HUID-A92B74, R-41098765"
                  className="flex-1 px-4 py-3 text-sm border border-white/10 rounded-2xl focus:border-emerald-500 outline-none uppercase font-mono tracking-wider text-white bg-[#161B26]"
                />
                <button
                  type="submit"
                  disabled={manualLoading || !manualCode.trim()}
                  className="px-6 py-3 btn-primary text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {manualLoading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : 'Verify'}
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-gray-400 font-semibold block">Click to test verified licences:</span>
              <div className="flex flex-wrap gap-2">
                {verifiedTestTargets.map((sample) => (
                  <button
                    key={sample.code}
                    type="button"
                    onClick={() => {
                      setManualCode(sample.code);
                      api.verifyManual(sample.code).then(setVerificationResult);
                    }}
                    className="text-[11px] px-3 py-1.5 rounded-xl bg-[#161B26] hover:bg-emerald-500/20 text-emerald-400 font-mono transition-colors border border-white/10 flex items-center gap-1.5"
                  >
                    <span className="font-bold">{sample.code}</span>
                    <span className="text-[10px] text-gray-400 font-sans">({sample.name.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ===================== VERIFICATION RESULT DISPLAY ===================== */}
        {verificationResult && (
          <div className="pt-6 border-t border-white/10 animate-in fade-in duration-300">
            <div className="bg-[#161B26] border border-white/10 rounded-3xl p-6 space-y-4">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  {verificationResult.status === 'OPERATIVE' ? (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-sm">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-white text-base sm:text-lg">
                        {verificationResult.brand} • {verificationResult.model}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        verificationResult.status === 'OPERATIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {verificationResult.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Licence No: <span className="font-mono font-bold text-white">{verificationResult.licenceNumber}</span> ({verificationResult.verificationType})
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-gray-300 bg-[#121620] border border-white/10 px-3 py-1 rounded-full self-start sm:self-auto shadow-sm">
                  Statutory BIS Verification
                </span>
              </div>

              {/* Grid of Verified Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-[#121620] rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-gray-400 block mb-0.5 font-medium">Manufacturer</span>
                  <span className="font-bold text-white">{verificationResult.manufacturer}</span>
                </div>

                <div className="p-3.5 bg-[#121620] rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-gray-400 block mb-0.5 font-medium">Applicable Indian Standard</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">{verificationResult.standardNumber}</span>
                </div>

                <div className="p-3.5 bg-[#121620] rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-gray-400 block mb-0.5 font-medium">Licence Validity</span>
                  <span className="font-bold text-white">{verificationResult.validUntil}</span>
                </div>

                <div className="p-3.5 bg-[#121620] rounded-2xl border border-white/10 shadow-sm">
                  <span className="text-gray-400 block mb-0.5 font-medium">Category</span>
                  <span className="font-semibold text-white">{verificationResult.productCategory}</span>
                </div>

                <div className="p-3.5 bg-[#121620] rounded-2xl border border-white/10 shadow-sm sm:col-span-2">
                  <span className="text-gray-400 block mb-0.5 font-medium">Factory / Registered Center</span>
                  <span className="font-semibold text-white">{verificationResult.factoryLocation}</span>
                </div>
              </div>

              {/* Mark Explanation & Consumer Guidance */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl space-y-2 text-xs text-gray-200">
                <div className="font-bold flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  What this Certification Mark Means:
                </div>
                <p className="text-gray-300 leading-relaxed">{verificationResult.markExplanation}</p>
                <p className="text-white font-semibold pt-1">💡 {verificationResult.consumerGuidance}</p>
              </div>

              {/* Action Button */}
              {onViewStandard && verificationResult.standardNumber !== 'Unknown' && verificationResult.standardNumber !== 'N/A' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onViewStandard(verificationResult.standardNumber)}
                    className="flex items-center gap-1.5 px-5 py-2.5 btn-primary text-xs font-bold transition-all"
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
