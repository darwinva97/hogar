import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Storage configuration from environment
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local' // 'local' | 's3'
const S3_ENDPOINT = process.env.S3_ENDPOINT // For B2: https://s3.us-west-000.backblazeb2.com
const S3_REGION = process.env.S3_REGION || 'us-east-1'
const S3_BUCKET = process.env.S3_BUCKET || 'hogar'
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_KEY = process.env.S3_SECRET_KEY
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL // CDN or public bucket URL

// Local storage config
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const LOCAL_PUBLIC_PATH = '/uploads'

// Initialize S3 client (lazy)
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: S3_ENDPOINT,
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY!,
        secretAccessKey: S3_SECRET_KEY!,
      },
      forcePathStyle: true, // Required for B2 and MinIO
    })
  }
  return s3Client
}

// Generate unique filename
function generateFileName(originalName: string): string {
  const ext = path.extname(originalName)
  const hash = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  return `${timestamp}-${hash}${ext}`
}

// Get content type from extension
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  return types[ext] || 'application/octet-stream'
}

export interface UploadResult {
  url: string
  key: string
  size: number
}

/**
 * Upload a file to storage
 */
export async function uploadFile(
  file: File,
  folder: string = 'products'
): Promise<UploadResult> {
  const fileName = generateFileName(file.name)
  const key = `${folder}/${fileName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  if (STORAGE_TYPE === 's3') {
    return uploadToS3(buffer, key, file.type || getContentType(file.name), file.size)
  } else {
    return uploadToLocal(buffer, key, file.size)
  }
}

/**
 * Upload buffer to S3-compatible storage
 */
async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string,
  size: number
): Promise<UploadResult> {
  const client = getS3Client()

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Make public readable
      ACL: 'public-read',
    })
  )

  // Construct public URL
  const url = S3_PUBLIC_URL
    ? `${S3_PUBLIC_URL}/${key}`
    : `${S3_ENDPOINT}/${S3_BUCKET}/${key}`

  return { url, key, size }
}

/**
 * Upload buffer to local filesystem
 */
async function uploadToLocal(
  buffer: Buffer,
  key: string,
  size: number
): Promise<UploadResult> {
  const filePath = path.join(LOCAL_UPLOAD_DIR, key)
  const dir = path.dirname(filePath)

  // Ensure directory exists
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  await writeFile(filePath, buffer)

  const url = `${LOCAL_PUBLIC_PATH}/${key}`

  return { url, key, size }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  if (STORAGE_TYPE === 's3') {
    await deleteFromS3(key)
  } else {
    await deleteFromLocal(key)
  }
}

async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client()

  await client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    })
  )
}

async function deleteFromLocal(key: string): Promise<void> {
  const filePath = path.join(LOCAL_UPLOAD_DIR, key)

  try {
    await unlink(filePath)
  } catch (error) {
    // Ignore if file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

/**
 * Get a presigned URL for direct upload (optional, for large files)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  if (STORAGE_TYPE !== 's3') {
    throw new Error('Presigned URLs only available with S3 storage')
  }

  const client = getS3Client()

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(client, command, { expiresIn })
}

/**
 * Check if storage is properly configured
 */
export function isStorageConfigured(): boolean {
  if (STORAGE_TYPE === 's3') {
    return !!(S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY && S3_BUCKET)
  }
  return true // Local storage always works
}

/**
 * Get storage type for debugging
 */
export function getStorageType(): string {
  return STORAGE_TYPE
}
