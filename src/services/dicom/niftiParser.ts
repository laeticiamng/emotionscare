/**
 * Service de parsing NIfTI
 * Support .nii et .nii.gz
 */

import { logger } from '@/lib/logger';

export interface NiftiHeader {
  dim: number[];
  pixdim: number[];
  datatype: number;
  bitpix: number;
  voxOffset: number;
  sclSlope: number;
  sclInter: number;
  xyztUnits: number;
  descrip: string;
  qformCode: number;
  sformCode: number;
}

export interface NiftiParseResult {
  success: boolean;
  header?: NiftiHeader;
  data?: Float32Array;
  dimensions?: [number, number, number];
  voxelSize?: [number, number, number];
  error?: string;
}

// Constantes NIfTI
const NIFTI1_MAGIC = [0x6E, 0x69, 0x31, 0x00]; // "ni1\0"
const NIFTI1_MAGIC_PAIR = [0x6E, 0x2B, 0x31, 0x00]; // "n+1\0"
const NIFTI2_MAGIC = [0x6E, 0x69, 0x32, 0x00]; // "ni2\0"
const NIFTI2_MAGIC_PAIR = [0x6E, 0x2B, 0x32, 0x00]; // "n+2\0"

/**
 * Parse un fichier NIfTI
 */
export async function parseNiftiFile(file: File): Promise<NiftiParseResult> {
  try {
    let arrayBuffer = await file.arrayBuffer();
    
    // Décompresser si .gz
    if (file.name.endsWith('.gz')) {
      arrayBuffer = await decompressGzip(arrayBuffer);
    }
    
    const dataView = new DataView(arrayBuffer);
    
    // Détecter la version NIfTI
    const sizeof_hdr = dataView.getInt32(0, true);
    
    let header: NiftiHeader;
    let voxOffset: number;
    
    if (sizeof_hdr === 348) {
      // NIfTI-1
      header = parseNifti1Header(dataView);
      voxOffset = header.voxOffset;
    } else if (sizeof_hdr === 540) {
      // NIfTI-2
      header = parseNifti2Header(dataView);
      voxOffset = header.voxOffset;
    } else {
      return { success: false, error: 'Format NIfTI non reconnu' };
    }
    
    // Vérifier le magic number
    const magic = [
      dataView.getUint8(344),
      dataView.getUint8(345),
      dataView.getUint8(346),
      dataView.getUint8(347),
    ];
    
    const isValidMagic = 
      arraysEqual(magic, NIFTI1_MAGIC) ||
      arraysEqual(magic, NIFTI1_MAGIC_PAIR) ||
      arraysEqual(magic, NIFTI2_MAGIC) ||
      arraysEqual(magic, NIFTI2_MAGIC_PAIR);
    
    if (!isValidMagic) {
      logger.warn('Magic number NIfTI non standard', { magic }, 'NIFTI');
    }
    
    const dimensions: [number, number, number] = [
      header.dim[1] || 1,
      header.dim[2] || 1,
      header.dim[3] || 1,
    ];
    
    const voxelSize: [number, number, number] = [
      header.pixdim[1] || 1,
      header.pixdim[2] || 1,
      header.pixdim[3] || 1,
    ];
    
    // Extraire les données voxels
    const data = extractVoxelData(dataView, header, Math.floor(voxOffset));
    
    logger.info('NIfTI parsé avec succès', { dimensions, voxelSize }, 'NIFTI');
    
    return {
      success: true,
      header,
      data,
      dimensions,
      voxelSize,
    };
  } catch (error) {
    logger.error('Erreur parsing NIfTI', error as Error, 'NIFTI');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

function parseNifti1Header(dataView: DataView): NiftiHeader {
  const dim: number[] = [];
  for (let i = 0; i < 8; i++) {
    dim.push(dataView.getInt16(40 + i * 2, true));
  }
  
  const pixdim: number[] = [];
  for (let i = 0; i < 8; i++) {
    pixdim.push(dataView.getFloat32(76 + i * 4, true));
  }
  
  return {
    dim,
    pixdim,
    datatype: dataView.getInt16(70, true),
    bitpix: dataView.getInt16(72, true),
    voxOffset: dataView.getFloat32(108, true),
    sclSlope: dataView.getFloat32(112, true),
    sclInter: dataView.getFloat32(116, true),
    xyztUnits: dataView.getUint8(123),
    descrip: readString(dataView, 148, 80),
    qformCode: dataView.getInt16(252, true),
    sformCode: dataView.getInt16(254, true),
  };
}

function parseNifti2Header(dataView: DataView): NiftiHeader {
  const dim: number[] = [];
  for (let i = 0; i < 8; i++) {
    dim.push(Number(dataView.getBigInt64(16 + i * 8, true)));
  }
  
  const pixdim: number[] = [];
  for (let i = 0; i < 8; i++) {
    pixdim.push(dataView.getFloat64(104 + i * 8, true));
  }
  
  return {
    dim,
    pixdim,
    datatype: dataView.getInt16(12, true),
    bitpix: dataView.getInt16(14, true),
    voxOffset: Number(dataView.getBigInt64(168, true)),
    sclSlope: dataView.getFloat64(176, true),
    sclInter: dataView.getFloat64(184, true),
    xyztUnits: dataView.getUint8(500),
    descrip: readString(dataView, 240, 80),
    qformCode: dataView.getInt32(344, true),
    sformCode: dataView.getInt32(348, true),
  };
}

function extractVoxelData(dataView: DataView, header: NiftiHeader, voxOffset: number): Float32Array {
  const numVoxels = header.dim[1] * header.dim[2] * header.dim[3];
  const data = new Float32Array(numVoxels);
  
  const slope = header.sclSlope || 1;
  const inter = header.sclInter || 0;
  
  for (let i = 0; i < numVoxels; i++) {
    let value: number;
    
    switch (header.datatype) {
      case 2: // UINT8
        value = dataView.getUint8(voxOffset + i);
        break;
      case 4: // INT16
        value = dataView.getInt16(voxOffset + i * 2, true);
        break;
      case 8: // INT32
        value = dataView.getInt32(voxOffset + i * 4, true);
        break;
      case 16: // FLOAT32
        value = dataView.getFloat32(voxOffset + i * 4, true);
        break;
      case 64: // FLOAT64
        value = dataView.getFloat64(voxOffset + i * 8, true);
        break;
      case 256: // INT8
        value = dataView.getInt8(voxOffset + i);
        break;
      case 512: // UINT16
        value = dataView.getUint16(voxOffset + i * 2, true);
        break;
      default:
        value = 0;
    }
    
    data[i] = value * slope + inter;
  }
  
  return data;
}

function readString(dataView: DataView, offset: number, length: number): string {
  const bytes = new Uint8Array(dataView.buffer, offset, length);
  return new TextDecoder().decode(bytes).replace(/\0/g, '').trim();
}

function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

async function decompressGzip(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  // Utiliser DecompressionStream si disponible
  if ('DecompressionStream' in window) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
    
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const reader = decompressedStream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result.buffer;
  }
  
  throw new Error('Décompression gzip non supportée dans ce navigateur');
}

/**
 * Valider qu'un fichier est un NIfTI
 */
export function isNiftiFile(file: File): boolean {
  const validExtensions = ['.nii', '.nii.gz', '.NII', '.NII.GZ'];
  return validExtensions.some(ext => file.name.endsWith(ext));
}
