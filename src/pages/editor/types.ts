export interface SourceItem {
  application_id: number;
  attrs: {
    size?: number; // File size
    type?: string; // File type
    wave?: string; // Audio wave json
    frames?: string; // Frame image
    width?: number;
    height?: number;
    naturalWidth?: number;
    naturalHeight?: number;
    videoHeight?: number;
    videoWidth?: number;
    duration?: number;
    rotate?: boolean; // Whether video is rotated
    hasAduioTrack?: boolean; // Whether video has audio track
  };
  category_id: string; // Category id
  convert_status: number; // Encoding status, server transcoding
  createdAt: string; // Created time
  deletedAt: string; // Deleted time
  id: string; // id
  name: string; // Material name
  size: number; // Material size in kb
  sort: number; // Sort order
  sub_type: string; // Type: video, image, audio
  tag: string; // Tag
  type?: string; // File type
  updatedAt: string; // Updated time
  urls: {
    url: string; // Original URL
    thumb: string; // Thumbnail image
  };
  user_id: string; // User id
}
