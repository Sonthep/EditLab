# backend/api/media.py
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse, FileResponse

router = APIRouter(prefix="/api/media", tags=["media"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

def send_partial_video(video_path: Path, request: Request):
    if not video_path.exists() or not video_path.is_file():
        raise HTTPException(status_code=404, detail="Video file not found")

    file_size = video_path.stat().st_size
    range_header = request.headers.get("range")

    if not range_header:
        # Full content response
        def iterfile():
            with open(video_path, mode="rb") as file_like:
                yield from file_like
        return StreamingResponse(
            iterfile(),
            media_type="video/mp4",
            headers={"Content-Length": str(file_size), "Accept-Ranges": "bytes"}
        )

    # Range request: e.g. "bytes=0-1000" or "bytes=500-"
    byte_range = range_header.replace("bytes=", "").split("-")
    start = int(byte_range[0])
    end = int(byte_range[1]) if byte_range[1] else file_size - 1

    if start >= file_size or end >= file_size:
        raise HTTPException(
            status_code=status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE,
            detail="Requested range not satisfiable"
        )

    chunk_size = 1024 * 1024 # 1 MB chunks
    content_length = (end - start) + 1

    def iterfile_range(start_pos, chunk_len):
        with open(video_path, mode="rb") as file_like:
            file_like.seek(start_pos)
            bytes_left = chunk_len
            while bytes_left > 0:
                read_bytes = min(bytes_left, chunk_size)
                data = file_like.read(read_bytes)
                if not data:
                    break
                bytes_left -= len(data)
                yield data

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(content_length),
        "Content-Type": "video/mp4",
    }
    return StreamingResponse(iterfile_range(start, content_length), status_code=206, headers=headers)

@router.get("/stream")
async def stream_video(path: str, request: Request):
    target = Path(path)
    if not target.is_absolute():
        target = (DATA_DIR / path).resolve()
    return send_partial_video(target, request)

@router.get("/thumbnails/{filename}")
async def get_thumbnail(filename: str):
    file_path = DATA_DIR / "thumbnails" / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Thumbnail not found")
    return FileResponse(file_path, media_type="image/jpeg")
