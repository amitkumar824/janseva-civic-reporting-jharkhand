import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

/**
 * Upload image to Cloudinary
 * @param imageData - Base64 encoded image data
 * @param folder - Optional folder name for organization
 * @returns Promise<UploadResult>
 */
export const uploadToCloudinary = async (
  imageData: string, 
  folder: string = 'janseva-issues'
): Promise<string> => {
  try {
    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Upload to Cloudinary
    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Resize for optimization
            { quality: 'auto:good' } // Optimize quality
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              secure_url: result.secure_url
            });
          } else {
            reject(new Error('Upload failed'));
          }
        }
      ).end(Buffer.from(base64Data, 'base64'));
    });

    return result.url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image
 * @returns Promise<boolean>
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Get optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param transformations - Array of transformation options
 * @returns string
 */
export const getOptimizedImageUrl = (
  publicId: string, 
  transformations: any[] = []
): string => {
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true
  });
};

/**
 * Generate thumbnail URL
 * @param publicId - Public ID of the image
 * @param width - Width of thumbnail
 * @param height - Height of thumbnail
 * @returns string
 */
export const getThumbnailUrl = (
  publicId: string, 
  width: number = 150, 
  height: number = 150
): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill' },
      { quality: 'auto:low' }
    ],
    secure: true
  });
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param publicId - Public ID of the image
 * @returns Object with different size URLs
 */
export const getResponsiveImageUrls = (publicId: string) => {
  return {
    small: getThumbnailUrl(publicId, 300, 300),
    medium: getThumbnailUrl(publicId, 600, 600),
    large: getThumbnailUrl(publicId, 1200, 1200),
    original: cloudinary.url(publicId, { secure: true })
  };
};
