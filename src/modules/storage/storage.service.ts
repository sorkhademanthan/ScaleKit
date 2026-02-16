import { v2 as cloudinary } from "cloudinary";

export class StorageService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn("Cloudinary is missing API keys. Uploads will fail.");
        }
    }

    /**
     * Generates a signed upload signature for direct client-to-Cloudinary upload.
     * This avoids files hitting our server, maintaining the "Direct Upload" architecture.
     * 
     * @param userId - Used for folder organization or public_id prefix
     */
    async getUploadSignature(userId: string) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = `avatars/${userId}`; // Organize by user

        // Parameters used for the signature
        const paramsStr = `folder=${folder}&timestamp=${timestamp}`;

        // Generate Signature
        // Signature = SHA1(params + api_secret)
        const signature = cloudinary.utils.api_sign_request(
            {
                folder,
                timestamp,
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return {
            timestamp,
            folder,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        };
    }
}

export const storageService = new StorageService();
