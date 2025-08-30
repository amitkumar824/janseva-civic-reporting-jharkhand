#!/usr/bin/env python3
"""
Civic Issue Analyzer - Converted from Jupyter Notebook
Integrates with Jan Seva Backend for real-time civic issue analysis
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Optional
import base64
import io

# ML Model Imports
try:
    from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
    from PIL import Image
    import torch
except ImportError as e:
    print(f"Error importing ML libraries: {e}")
    print("Please install required packages: pip install transformers torch pillow")
    sys.exit(1)

class CivicAnalyzer:
    def __init__(self):
        """Initialize the ML models"""
        try:
            print("Loading BLIP model for image captioning...")
            self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
            self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
            
            print("Loading Whisper model for speech-to-text...")
            self.asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
            
            print("Models loaded successfully!")
        except Exception as e:
            print(f"Error loading models: {e}")
            raise

    def generate_caption(self, image_path: str) -> str:
        """Generate caption from image using BLIP"""
        try:
            if not image_path or image_path == "None":
                return "No image provided"
            
            # Handle base64 encoded images
            if image_path.startswith('data:image'):
                # Remove data URL prefix
                image_data = image_path.split(',')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
            else:
                # Handle file path
                image = Image.open(image_path)
            
            inputs = self.processor(images=image, return_tensors="pt")
            out = self.model.generate(**inputs, max_new_tokens=30)
            caption = self.processor.decode(out[0], skip_special_tokens=True)
            return caption
        except Exception as e:
            print(f"Error generating caption: {e}")
            return "Error processing image"

    def speech_to_text(self, audio_path: str) -> str:
        """Convert speech to text using Whisper"""
        try:
            if not audio_path or audio_path == "None":
                return ""
            text = self.asr(audio_path)["text"]
            return text
        except Exception as e:
            print(f"Error converting speech to text: {e}")
            return ""

    def normalize_text(self, text: str) -> str:
        """Normalize Hinglish text to English"""
        if not text:
            return ""
        
        text = text.lower()
        replacements = {
            "paani": "water",
            "gaddha": "pothole", 
            "sadak": "road",
            "bijli": "electricity",
            "light": "streetlight",
            "kooda": "garbage",
            "dustbin": "dustbin",
            "pipe": "pipeline",
            "leak": "leakage",
            "nala": "drainage",
            "gutter": "drainage",
            "traffic": "traffic",
            "signal": "traffic signal"
        }
        
        for k, v in replacements.items():
            text = text.replace(k, v)
        return text

    def identify_problem(self, caption: str, text: str) -> str:
        """Identify the civic problem from caption and text"""
        combined = caption.lower() + " " + text.lower()
        
        if "pothole" in combined or "road" in combined or "damage" in combined:
            return "Pothole / Road Damage"
        elif "streetlight" in combined or "light" in combined or "electricity" in combined:
            return "Streetlight / Electrical Issue"
        elif "water" in combined or "leak" in combined or "pipeline" in combined:
            return "Water Leakage / Pipeline Issue"
        elif "garbage" in combined or "dustbin" in combined or "sanitation" in combined:
            return "Garbage / Sanitation Issue"
        elif "drainage" in combined or "gutter" in combined or "nala" in combined:
            return "Drainage Issue"
        elif "traffic" in combined or "signal" in combined:
            return "Traffic / Signal Issue"
        else:
            return "Other Civic Issue"

    def map_department(self, problem: str) -> str:
        """Map problem to responsible department"""
        mapping = {
            "Pothole / Road Damage": "Roads Department",
            "Streetlight / Electrical Issue": "Electrical Department", 
            "Water Leakage / Pipeline Issue": "Water Department",
            "Garbage / Sanitation Issue": "Sanitation Department",
            "Drainage Issue": "Drainage Department",
            "Traffic / Signal Issue": "Traffic Department",
            "Other Civic Issue": "General Complaints Department"
        }
        return mapping.get(problem, "General Complaints Department")

    def map_priority(self, problem: str) -> str:
        """Map problem to priority level"""
        high_priority = ["Water Leakage / Pipeline Issue", "Electrical Issue"]
        if problem in high_priority:
            return "HIGH"
        elif "Road" in problem or "Traffic" in problem:
            return "MEDIUM"
        else:
            return "LOW"

    def map_category(self, problem: str) -> str:
        """Map problem to issue category"""
        if "Road" in problem:
            return "ROAD"
        elif "Streetlight" in problem or "Electrical" in problem:
            return "STREETLIGHT"
        elif "Water" in problem:
            return "WATER"
        elif "Garbage" in problem or "Sanitation" in problem:
            return "SANITATION"
        elif "Drainage" in problem:
            return "OTHER"
        elif "Traffic" in problem:
            return "OTHER"
        else:
            return "OTHER"

    def analyze_civic_issue(self, image_path: str = None, text: str = None, 
                           audio_path: str = None, location: str = None) -> Dict[str, Any]:
        """Main analysis pipeline"""
        try:
            # Generate caption from image
            caption = self.generate_caption(image_path) if image_path else "No image provided"
            
            # Get text input (from either text or audio)
            norm_text = ""
            if text:
                norm_text = self.normalize_text(text)
            elif audio_path:
                voice_text = self.speech_to_text(audio_path)
                norm_text = self.normalize_text(voice_text)
            
            # Problem identification
            problem = self.identify_problem(caption, norm_text)
            department = self.map_department(problem)
            priority = self.map_priority(problem)
            category = self.map_category(problem)
            
            # Return structured result
            result = {
                "success": True,
                "data": {
                    "imageCaption": caption,
                    "complaintText": norm_text if norm_text else "(no text/voice provided)",
                    "problemIdentified": problem,
                    "department": department,
                    "priority": priority,
                    "category": category,
                    "location": location if location else "(no GPS provided)",
                    "confidence": 0.85  # Placeholder confidence score
                }
            }
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": None
            }

def main():
    """Main function for command line usage"""
    parser = argparse.ArgumentParser(description="Civic Issue Analyzer")
    parser.add_argument("--image", help="Path to image file or base64 string")
    parser.add_argument("--text", help="Text description of the issue")
    parser.add_argument("--audio", help="Path to audio file")
    parser.add_argument("--location", help="GPS coordinates or location string")
    parser.add_argument("--output", choices=["json", "text"], default="json", 
                       help="Output format")
    
    args = parser.parse_args()
    
    try:
        # Initialize analyzer
        analyzer = CivicAnalyzer()
        
        # Analyze the issue
        result = analyzer.analyze_civic_issue(
            image_path=args.image,
            text=args.text,
            audio_path=args.audio,
            location=args.location
        )
        
        # Output result
        if args.output == "json":
            print(json.dumps(result, indent=2))
        else:
            if result["success"]:
                data = result["data"]
                print(f"Problem: {data['problemIdentified']}")
                print(f"Department: {data['department']}")
                print(f"Priority: {data['priority']}")
                print(f"Category: {data['category']}")
                print(f"Caption: {data['imageCaption']}")
                print(f"Text: {data['complaintText']}")
            else:
                print(f"Error: {result['error']}")
                
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
