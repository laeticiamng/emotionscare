/**
 * Service de parsing DICOM
 * Implémentation légère sans dépendance cornerstone
 */

import { logger } from '@/lib/logger';

export interface DicomMetadata {
  patientId?: string;
  patientName?: string;
  studyDate?: string;
  modality?: string;
  seriesDescription?: string;
  manufacturer?: string;
  dimensions?: [number, number, number];
  voxelSize?: [number, number, number];
  windowCenter?: number;
  windowWidth?: number;
}

export interface DicomParseResult {
  success: boolean;
  metadata?: DicomMetadata;
  pixelData?: Uint16Array | Int16Array | Uint8Array;
  error?: string;
}

// Tags DICOM courants
const DICOM_TAGS = {
  PATIENT_ID: '00100020',
  PATIENT_NAME: '00100010',
  STUDY_DATE: '00080020',
  MODALITY: '00080060',
  SERIES_DESC: '0008103E',
  MANUFACTURER: '00080070',
  ROWS: '00280010',
  COLUMNS: '00280011',
  PIXEL_SPACING: '00280030',
  SLICE_THICKNESS: '00180050',
  WINDOW_CENTER: '00281050',
  WINDOW_WIDTH: '00281051',
  BITS_ALLOCATED: '00280100',
  PIXEL_REPRESENTATION: '00280103',
  PIXEL_DATA: '7FE00010',
};

/**
 * Parse un fichier DICOM
 */
export async function parseDicomFile(file: File): Promise<DicomParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    
    // Vérifier le préambule DICOM (128 octets + "DICM")
    if (arrayBuffer.byteLength < 132) {
      return { success: false, error: 'Fichier trop petit pour être un DICOM valide' };
    }
    
    const dicmPrefix = String.fromCharCode(
      dataView.getUint8(128),
      dataView.getUint8(129),
      dataView.getUint8(130),
      dataView.getUint8(131)
    );
    
    if (dicmPrefix !== 'DICM') {
      // Essayer de parser comme DICOM implicite (sans préambule)
      logger.warn('Fichier DICOM sans préambule standard, tentative de parsing implicite', {}, 'DICOM');
    }
    
    const metadata: DicomMetadata = {};
    
    // Parser les tags (version simplifiée)
    let offset = 132; // Après le préambule
    
    while (offset < arrayBuffer.byteLength - 8) {
      const group = dataView.getUint16(offset, true);
      const element = dataView.getUint16(offset + 2, true);
      const tag = group.toString(16).padStart(4, '0') + element.toString(16).padStart(4, '0');
      
      // VR (Value Representation)
      const vr = String.fromCharCode(dataView.getUint8(offset + 4), dataView.getUint8(offset + 5));
      
      let valueLength: number;
      let valueOffset: number;
      
      // VR explicites avec longueur sur 2 octets
      if (['AE', 'AS', 'AT', 'CS', 'DA', 'DS', 'DT', 'FL', 'FD', 'IS', 'LO', 'LT', 'PN', 'SH', 'SL', 'SS', 'ST', 'TM', 'UI', 'UL', 'US'].includes(vr)) {
        valueLength = dataView.getUint16(offset + 6, true);
        valueOffset = offset + 8;
      } else {
        // VR avec longueur sur 4 octets (OB, OD, OF, OL, OW, SQ, UC, UN, UR, UT)
        valueLength = dataView.getUint32(offset + 8, true);
        valueOffset = offset + 12;
      }
      
      // Éviter les boucles infinies
      if (valueLength === 0xFFFFFFFF || valueLength > arrayBuffer.byteLength - valueOffset) {
        break;
      }
      
      // Extraire les valeurs des tags importants
      try {
        const value = extractTagValue(dataView, valueOffset, valueLength, vr);
        
        switch (tag.toUpperCase()) {
          case DICOM_TAGS.PATIENT_ID:
            metadata.patientId = value as string;
            break;
          case DICOM_TAGS.PATIENT_NAME:
            metadata.patientName = value as string;
            break;
          case DICOM_TAGS.STUDY_DATE:
            metadata.studyDate = formatDicomDate(value as string);
            break;
          case DICOM_TAGS.MODALITY:
            metadata.modality = value as string;
            break;
          case DICOM_TAGS.SERIES_DESC:
            metadata.seriesDescription = value as string;
            break;
          case DICOM_TAGS.MANUFACTURER:
            metadata.manufacturer = value as string;
            break;
          case DICOM_TAGS.ROWS:
            metadata.dimensions = metadata.dimensions || [0, 0, 1];
            metadata.dimensions[0] = value as number;
            break;
          case DICOM_TAGS.COLUMNS:
            metadata.dimensions = metadata.dimensions || [0, 0, 1];
            metadata.dimensions[1] = value as number;
            break;
          case DICOM_TAGS.WINDOW_CENTER:
            metadata.windowCenter = parseFloat(value as string);
            break;
          case DICOM_TAGS.WINDOW_WIDTH:
            metadata.windowWidth = parseFloat(value as string);
            break;
        }
      } catch {
        // Ignorer les erreurs de parsing de valeur
      }
      
      offset = valueOffset + valueLength;
      
      // Aligner sur un multiple de 2
      if (offset % 2 !== 0) offset++;
    }
    
    logger.info('DICOM parsé avec succès', { metadata }, 'DICOM');
    
    return {
      success: true,
      metadata,
    };
  } catch (error) {
    logger.error('Erreur parsing DICOM', error as Error, 'DICOM');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

function extractTagValue(
  dataView: DataView, 
  offset: number, 
  length: number, 
  vr: string
): string | number {
  if (vr === 'US') {
    return dataView.getUint16(offset, true);
  }
  if (vr === 'SS') {
    return dataView.getInt16(offset, true);
  }
  if (vr === 'UL') {
    return dataView.getUint32(offset, true);
  }
  if (vr === 'SL') {
    return dataView.getInt32(offset, true);
  }
  if (vr === 'FL') {
    return dataView.getFloat32(offset, true);
  }
  if (vr === 'FD') {
    return dataView.getFloat64(offset, true);
  }
  
  // String types
  const bytes = new Uint8Array(dataView.buffer, offset, length);
  return new TextDecoder().decode(bytes).replace(/\0/g, '').trim();
}

function formatDicomDate(dateStr: string): string {
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

/**
 * Anonymiser les métadonnées DICOM
 */
export function anonymizeDicomMetadata(metadata: DicomMetadata): DicomMetadata {
  return {
    ...metadata,
    patientId: 'ANON_' + Date.now().toString(36),
    patientName: 'Anonyme',
  };
}

/**
 * Valider qu'un fichier est un DICOM
 */
export function isDicomFile(file: File): boolean {
  const validExtensions = ['.dcm', '.dicom', '.DCM', '.DICOM'];
  const hasValidExtension = validExtensions.some(ext => file.name.endsWith(ext));
  const hasValidMimeType = file.type === 'application/dicom' || file.type === 'application/octet-stream';
  
  return hasValidExtension || hasValidMimeType;
}
