// Cloudinary service for image uploads
export class CloudinaryService {
  private static instance: CloudinaryService;
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    // You can set these in your .env file
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
  }

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  // Upload image to Cloudinary
  public async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('cloud_name', this.cloudName);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload multiple images
  public async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  // Convert base64 to file and upload
  public async uploadBase64Image(base64String: string, fileName: string = 'image.jpg'): Promise<string> {
    try {
      // Convert base64 to file
      const response = await fetch(base64String);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });

      return await this.uploadImage(file);
    } catch (error) {
      console.error('Error uploading base64 image:', error);
      throw error;
    }
  }

  // Get optimized image URL
  public getOptimizedUrl(originalUrl: string, width: number = 800, height: number = 600): string {
    if (!originalUrl.includes('cloudinary.com')) {
      return originalUrl;
    }

    // Add transformation parameters for optimization
    const baseUrl = originalUrl.split('/upload/')[0] + '/upload/';
    const imagePath = originalUrl.split('/upload/')[1];
    
    return `${baseUrl}c_fill,w_${width},h_${height},q_auto/${imagePath}`;
  }

  // Get thumbnail URL
  public getThumbnailUrl(originalUrl: string, size: number = 150): string {
    return this.getOptimizedUrl(originalUrl, size, size);
  }
}

export const cloudinaryService = CloudinaryService.getInstance();
