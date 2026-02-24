import os
import sys
from rembg import remove
from PIL import Image

DIR = r"d:\Antigravity\grand-transfer-light\public\images\tariffs"
files = [
    "econom_ai.png", "standard_ai.png", "comfort_ai.png", 
    "comfort_plus_ai.png", "business_ai.png", "minivan_ai.png", 
    "sober_ai.png", "delivery_ai.png"
]

TARGET_W, TARGET_H = 800, 600

def process_images():
    for f in files:
        path = os.path.join(DIR, f)
        if not os.path.exists(path):
            print(f"Skipping {f}, not found.")
            continue
            
        print(f"Processing {f}...")
        try:
            img = Image.open(path).convert("RGBA")
            
            # Remove background
            out = remove(img)
            
            # Get bounding box of the car
            bbox = out.getbbox()
            if bbox:
                out = out.crop(bbox)
                
                # Normalize size
                w, h = out.size
                scale = min(TARGET_W / w, TARGET_H / h) * 0.9 # 90% fill
                new_w, new_h = int(w * scale), int(h * scale)
                
                out = out.resize((new_w, new_h), Image.Resampling.LANCZOS)
                
                final_img = Image.new("RGBA", (TARGET_W, TARGET_H), (255, 255, 255, 0))
                final_img.paste(out, ((TARGET_W - new_w)//2, (TARGET_H - new_h)//2))
                
                final_img.save(path)
                print(f"Saved {f}")
            else:
                print(f"Failed to find bounding box in {f}")
        except Exception as e:
            print(f"Error processing {f}: {e}")

if __name__ == "__main__":
    process_images()
