'use client';
import { useState, useEffect } from 'react';

export function ConfirmModal() {
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handleConfirm = (e) => {
      setModalData({
        message: e.detail.message,
        onConfirm: e.detail.onConfirm,
        onCancel: e.detail.onCancel,
      });
    };
    window.addEventListener('dm-confirm', handleConfirm);
    return () => window.removeEventListener('dm-confirm', handleConfirm);
  }, []);

  if (!modalData) return null;

  const handleOk = () => {
    if (modalData.onConfirm) modalData.onConfirm();
    setModalData(null);
  };

  const handleCancel = () => {
    if (modalData.onCancel) modalData.onCancel();
    setModalData(null);
  };

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-olive-950/45 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-lg border border-lime-900/10 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-black text-olive-950">Confirm Action</h3>
        <p className="mt-2 text-sm text-olive-800 leading-relaxed">{modalData.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-md border border-lime-700/25 bg-white px-4 py-2 text-sm font-bold text-olive-800 transition hover:bg-lime-50"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            className="rounded-md bg-olive-900 px-4 py-2 text-sm font-bold text-lime-50 transition hover:bg-[#1b3013]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function customConfirm(message) {
  return new Promise((resolve) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent('dm-confirm', {
          detail: {
            message,
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
          },
        })
      );
    } else {
      resolve(true);
    }
  });
}
