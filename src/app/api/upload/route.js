// app/api/upload/route.js
import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'aajkal-events' }, (error, result) => {
        if (error) return reject(NextResponse.json({ error }));
        return resolve(NextResponse.json({ url: result.secure_url }));
      })
      .end(buffer);
  });
}
