/**
 * ImageUpload Component - Usage Examples
 *
 * This file demonstrates various use cases for the ImageUpload component
 */

import { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * Example 1: Single Avatar Upload
 * - Max 1 file
 * - Square dimensions required
 * - 512x512 max size
 */
export function AvatarUploadExample() {
  const [avatar, setAvatar] = useState<File[]>([]);

  const handleUpload = async () => {
    if (avatar.length === 0) return;

    // Upload to your backend/storage
    const formData = new FormData();
    formData.append('avatar', avatar[0]);

    // await uploadToStorage(formData);
    console.log('Uploading avatar:', avatar[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          onImagesChange={setAvatar}
          maxFiles={1}
          maxSizeMB={5}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
          maxDimensions={{ width: 512, height: 512 }}
          minDimensions={{ width: 128, height: 128 }}
        />
        <Button
          onClick={handleUpload}
          disabled={avatar.length === 0}
          className="mt-4"
        >
          Upload Avatar
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Example 2: Product Images Upload
 * - Multiple files (up to 5)
 * - Large file size limit (10MB)
 * - High resolution required
 */
export function ProductImagesExample() {
  const [productImages, setProductImages] = useState<File[]>([]);

  const handleSubmit = () => {
    console.log('Uploading product images:', productImages);
    // Process and upload images
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          onImagesChange={setProductImages}
          maxFiles={5}
          maxSizeMB={10}
          acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
          minDimensions={{ width: 800, height: 600 }}
        />
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {productImages.length} / 5 images selected
          </span>
          <Button onClick={handleSubmit} disabled={productImages.length === 0}>
            Upload Images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Example 3: Journal Photo Upload
 * - Single photo
 * - Mobile-friendly dimensions
 * - Reasonable file size
 */
export function JournalPhotoExample() {
  const [photo, setPhoto] = useState<File[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          onImagesChange={setPhoto}
          maxFiles={1}
          maxSizeMB={5}
          acceptedFormats={['image/jpeg', 'image/png']}
          maxDimensions={{ width: 4096, height: 4096 }}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Example 4: Compact Upload (without preview)
 * - No preview grid
 * - Multiple files
 * - Ideal for forms with limited space
 */
export function CompactUploadExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compact Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          onImagesChange={setFiles}
          maxFiles={3}
          maxSizeMB={5}
          showPreview={false}
        />
        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="text-sm">
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Example 5: Disabled State
 * - Shows how to disable the upload
 * - Useful during form submission or loading states
 */
export function DisabledUploadExample() {
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disabled While Uploading</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload
          onImagesChange={setImages}
          maxFiles={3}
          disabled={isUploading}
        />
        <Button
          onClick={handleUpload}
          disabled={images.length === 0 || isUploading}
          className="mt-4"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Full demo page showing all examples
 */
export function ImageUploadDemoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">ImageUpload Component Examples</h1>
        <p className="text-muted-foreground">
          Various use cases and configurations for the ImageUpload component
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AvatarUploadExample />
        <JournalPhotoExample />
        <ProductImagesExample />
        <CompactUploadExample />
        <DisabledUploadExample />
      </div>
    </div>
  );
}
