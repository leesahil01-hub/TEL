import React from "react";
import QRCode from "qrcode";

interface SpacedQRCodeProps {
  value: string;
  size?: number;
}

export default function SpacedQRCode({ value, size = 140 }: SpacedQRCodeProps) {
  let matrix: number[][] = [];
  let gridSize = 21;

  try {
    // Generate the real QR Code matrix using the 'qrcode' library
    const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
    gridSize = qr.modules.size;
    for (let r = 0; r < gridSize; r++) {
      const row: number[] = [];
      for (let c = 0; c < gridSize; c++) {
        row.push(qr.modules.get(r, c) ? 1 : 0);
      }
      matrix.push(row);
    }
  } catch (err) {
    console.error("Error creating QR Code matrix:", err);
    // Graceful 21x21 fallback matrix in case of errors
    gridSize = 21;
    matrix = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0));
  }

  const moduleSize = 8; // Coordinate size for each module in SVG space
  const totalSize = gridSize * moduleSize;

  // Render SVG rects
  const rects: React.ReactNode[] = [];
  const adjustedSize = moduleSize;
  const offset = 0;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (matrix[r]?.[c] === 1) {
        rects.push(
          <rect
            key={`m-${r}-${c}`}
            x={c * moduleSize + offset}
            y={r * moduleSize + offset}
            width={adjustedSize}
            height={adjustedSize}
            fill="black"
          />
        );
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-1 bg-white rounded border border-gray-100 shadow-sm print:shadow-none print:border-none">
      <svg
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="text-black"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White background */}
        <rect width={totalSize} height={totalSize} fill="white" />
        {/* Draw modules */}
        {rects}
      </svg>
    </div>
  );
}
