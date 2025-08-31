#!/usr/bin/env python3
"""
Enhanced Civic Issue Analyzer
Based on sih2k25.ipynb with improvements for production use
"""

import json
import base64
import io
import sys
import os
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
import re

class EnhancedCivicAnalyzer:
    def __init__(self):
        """Initialize the AI models"""
        try:
            # Load BLIP for Image Captioning
            self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
            self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
            
            # Load Whisper for Speech-to-Text
            self.asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
            
            print("✅ AI Models loaded successfully")
        except Exception as e:
            print(f"❌ Error loading AI models: {e}")
            raise

    def base64_to_image(self, base64_string):
        """Convert base64 string to PIL Image"""
        try:
            # Remove data URL prefix if present
            if base64_string.startswith('data:image'):
                base64_string = base64_string.split(',')[1]
            
            # Decode base64
            image_data = base64.b64decode(base64_string)
            image = Image.open(io.BytesIO(image_data))
            return image
        except Exception as e:
            print(f"Error converting base64 to image: {e}")
            return None

    def generate_caption(self, image):
        """Generate caption from image using BLIP with civic issue focus"""
        try:
            if image is None:
                return "No image provided"
            
            # Use more specific prompts for civic issues
            prompts = [
                "a photo showing a civic issue: ",
                "a photo of a problem in the city: ",
                "a photo of infrastructure issue: ",
                "a photo of public service problem: "
            ]
            
            best_caption = "Image analysis failed"
            best_score = 0
            
            for prompt in prompts:
                try:
                    inputs = self.processor(images=image, text=prompt, return_tensors="pt")
                    out = self.model.generate(**inputs, max_new_tokens=50)
                    caption = self.processor.decode(out[0], skip_special_tokens=True)
                    
                    # Score the caption based on civic issue keywords
                    civic_keywords = [
                        "road", "street", "light", "water", "garbage", "drainage", 
                        "traffic", "signal", "park", "damage", "broken", "leak",
                        "pothole", "dirty", "clean", "problem", "issue"
                    ]
                    
                    score = sum(1 for keyword in civic_keywords if keyword.lower() in caption.lower())
                    
                    if score > best_score:
                        best_score = score
                        best_caption = caption
                        
                except Exception as e:
                    continue
            
            # If no good civic caption found, use default
            if best_score == 0:
                inputs = self.processor(images=image, return_tensors="pt")
                out = self.model.generate(**inputs, max_new_tokens=50)
                best_caption = self.processor.decode(out[0], skip_special_tokens=True)
            
            return best_caption
            
        except Exception as e:
            print(f"Error generating caption: {e}")
            return "Image analysis failed"

    def speech_to_text(self, audio_data):
        """Convert speech to text using Whisper"""
        try:
            if not audio_data:
                return ""
            
            # Handle base64 audio data
            if isinstance(audio_data, str) and audio_data.startswith('data:audio'):
                audio_data = audio_data.split(',')[1]
                audio_bytes = base64.b64decode(audio_data)
                # Save temporarily and process
                with open("temp_audio.wav", "wb") as f:
                    f.write(audio_bytes)
                text = self.asr("temp_audio.wav")["text"]
                os.remove("temp_audio.wav")
                return text
            else:
                text = self.asr(audio_data)["text"]
                return text
        except Exception as e:
            print(f"Error in speech to text: {e}")
            return ""

    def normalize_text(self, text):
        """Normalize Hinglish text to English"""
        if not text:
            return ""
        
        text = text.lower()
        
        # Enhanced Hinglish to English mappings - Fixed to avoid conflicts
        replacements = {
            "paani": "water",
            "gaddha": "pothole",
            "sadak": "road",
            "bijli": "electricity",
            "light": "streetlight",
            "kooda": "garbage",
            "dustbin": "dustbin",
            "fire": "fire",
            "aag": "fire",
            "smoke": "smoke",
            "dhuan": "smoke",
            "noise": "noise",
            "shor": "noise",
            "pollution": "pollution",
            "pradushan": "pollution",
            "dirty": "dirty",
            "ganda": "dirty",
            "clean": "clean",
            "saf": "clean",
            "broken": "broken",
            "tuta": "broken",
            "damaged": "damaged",
            "kharab": "damaged",
            "fixed": "fixed",
            "theek": "fixed",
            "urgent": "urgent",
            "jaldi": "urgent",
            "important": "important",
            "mahatvapurn": "important",
            "problem": "problem",
            "samasya": "problem",
            "issue": "issue",
            "complaint": "complaint",
            "shikayat": "complaint",
            "help": "help",
            "madad": "help",
            "support": "support",
            "sahayata": "support"
        }
        
        # Sort replacements by length (longest first) to avoid partial matches
        sorted_replacements = sorted(replacements.items(), key=lambda x: len(x[0]), reverse=True)
        
        for hindi, english in sorted_replacements:
            # Use word boundaries to avoid partial matches
            text = re.sub(r'\b' + re.escape(hindi) + r'\b', english, text)
        
        return text

    def identify_problem(self, caption, text):
        """Enhanced problem identification"""
        combined = (caption + " " + text).lower()
        
        # Enhanced problem detection patterns with better matching
        problems = {
            "Pothole / Road Damage": [
                "pothole", "potholes", "road damage", "road broken", "road crack", "road hole",
                "sadak", "rasta", "sarak", "gaddha", "hole", "holes", "crack", "damage",
                "road has", "road with", "broken road", "damaged road"
            ],
            "Streetlight / Electrical Issue": [
                "streetlight", "street light", "light", "bulb", "electricity", "electrical",
                "power", "bijli", "light broken", "light not working", "dark", "andhera"
            ],
            "Water Leakage / Pipeline Issue": [
                "water leak", "water leakage", "pipeline", "pipe leak", "tap leak",
                "pani", "jal", "water supply", "water problem", "no water", "water pressure"
            ],
            "Garbage / Sanitation Issue": [
                "garbage", "trash", "waste", "dustbin", "kooda", "sanitation", "clean",
                "dirty", "ganda", "saf", "hygiene", "toilet", "shouchalaya"
            ],
            "Drainage Issue": [
                "drainage", "drain", "nala", "gutter", "sewer", "water logging",
                "flood", "water accumulation", "blocked drain"
            ],
            "Traffic / Signal Issue": [
                "traffic signal", "traffic light", "signal broken", "signal not working",
                "traffic management", "road safety", "accident", "congestion", "jam"
            ],
            "Park / Public Space Issue": [
                "park", "garden", "public space", "playground", "bagicha",
                "recreation", "benches", "trees", "plants"
            ],
            "Public Transport Issue": [
                "bus", "train", "transport", "public transport", "station", "stop",
                "bus stop", "metro", "auto", "rickshaw"
            ]
        }
        
        # Count matches for each problem type with better scoring
        problem_scores = {}
        for problem, keywords in problems.items():
            score = 0
            for keyword in keywords:
                # Use word boundaries for more accurate matching
                if re.search(r'\b' + re.escape(keyword) + r'\b', combined):
                    score += 1
            if score > 0:
                problem_scores[problem] = score
        
        # Return the problem with highest score, or default
        if problem_scores:
            return max(problem_scores, key=problem_scores.get)
        else:
            return "Other Civic Issue"

    def map_department(self, problem):
        """Map problem to responsible department"""
        mapping = {
            "Pothole / Road Damage": "Roads Department",
            "Streetlight / Electrical Issue": "Electrical Department",
            "Water Leakage / Pipeline Issue": "Water Department",
            "Garbage / Sanitation Issue": "Sanitation Department",
            "Drainage Issue": "Drainage Department",
            "Traffic / Signal Issue": "Traffic Department",
            "Park / Public Space Issue": "Parks & Recreation Department",
            "Public Transport Issue": "Transport Department",
            "Other Civic Issue": "General Complaints Department"
        }
        return mapping.get(problem, "General Complaints Department")

    def determine_priority(self, problem, caption, text):
        """Determine priority based on problem type and context"""
        combined = (caption + " " + text).lower()
        
        # High priority keywords
        high_priority_keywords = [
            "urgent", "emergency", "dangerous", "hazardous", "critical", "serious",
            "jaldi", "emergency", "danger", "risk", "accident", "injury", "fire",
            "electrical", "water", "gas", "leak", "broken", "falling"
        ]
        
        # Check for high priority keywords
        if any(keyword in combined for keyword in high_priority_keywords):
            return "HIGH"
        
        # High priority problems
        high_priority_problems = [
            "Water Leakage / Pipeline Issue",
            "Streetlight / Electrical Issue",
            "Traffic / Signal Issue"
        ]
        
        if problem in high_priority_problems:
            return "HIGH"
        
        # Medium priority problems
        medium_priority_problems = [
            "Pothole / Road Damage",
            "Drainage Issue"
        ]
        
        if problem in medium_priority_problems:
            return "MEDIUM"
        
        return "LOW"

    def map_category(self, problem):
        """Map problem to category"""
        mapping = {
            "Pothole / Road Damage": "ROAD",
            "Streetlight / Electrical Issue": "STREETLIGHT",
            "Water Leakage / Pipeline Issue": "WATER",
            "Garbage / Sanitation Issue": "SANITATION",
            "Drainage Issue": "DRAINAGE",
            "Traffic / Signal Issue": "TRAFFIC",
            "Park / Public Space Issue": "PUBLIC_SPACE",
            "Public Transport Issue": "TRANSPORT"
        }
        return mapping.get(problem, "OTHER")

    def generate_title(self, problem, caption):
        """Generate a descriptive title"""
        titles = {
            "Pothole / Road Damage": "Road Damage Issue",
            "Streetlight / Electrical Issue": "Street Light Problem",
            "Water Leakage / Pipeline Issue": "Water Supply Issue",
            "Garbage / Sanitation Issue": "Sanitation Problem",
            "Drainage Issue": "Drainage Problem",
            "Traffic / Signal Issue": "Traffic Management Issue",
            "Park / Public Space Issue": "Public Space Issue",
            "Public Transport Issue": "Transport Issue"
        }
        
        base_title = titles.get(problem, "Civic Issue Reported")
        
        # Add context from caption if available
        if caption and caption != "No image provided" and caption != "Image analysis failed":
            # Extract key words from caption
            words = caption.split()[:3]  # First 3 words
            context = " ".join(words)
            return f"{base_title} - {context}"
        
        return base_title

    def analyze_civic_issue(self, image_data=None, text=None, audio_data=None, location=None):
        """Main analysis function"""
        try:
            # Process image
            image = None
            caption = "No image provided"
            if image_data:
                image = self.base64_to_image(image_data)
                if image:
                    caption = self.generate_caption(image)
            
            # Process text/audio
            complaint_text = ""
            if text:
                complaint_text = self.normalize_text(text)
            elif audio_data:
                voice_text = self.speech_to_text(audio_data)
                complaint_text = self.normalize_text(voice_text)
            
            # If no text provided, use caption as description
            if not complaint_text and caption != "No image provided":
                complaint_text = f"Issue detected: {caption}"
            
            # Problem identification
            problem = self.identify_problem(caption, complaint_text)
            department = self.map_department(problem)
            priority = self.determine_priority(problem, caption, complaint_text)
            category = self.map_category(problem)
            title = self.generate_title(problem, caption)
            
            result = {
                "success": True,
                "data": {
                    "title": title,
                    "problemIdentified": problem,
                    "department": department,
                    "priority": priority,
                    "category": category,
                    "imageCaption": caption,
                    "complaintText": complaint_text or f"Issue detected from image analysis: {caption}",
                    "location": location or "Location not provided",
                    "aiConfidence": "high" if complaint_text else "medium"
                }
            }
            
            return result
            
        except Exception as e:
            print(f"Error in civic analysis: {e}")
            return {
                "success": False,
                "error": str(e),
                "data": {
                    "title": "Civic Issue Detected",
                    "problemIdentified": "Other Civic Issue",
                    "department": "General Complaints Department",
                    "priority": "MEDIUM",
                    "category": "OTHER",
                    "imageCaption": "Analysis failed",
                    "complaintText": "Issue detected from image analysis. Please provide additional details.",
                    "location": location or "Location not provided",
                    "aiConfidence": "low"
                }
            }

def main():
    """Main function for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python enhanced_civic_analyzer.py <json_input>")
        sys.exit(1)
    
    try:
        # Parse input
        input_data = json.loads(sys.argv[1])
        
        # Initialize analyzer
        analyzer = EnhancedCivicAnalyzer()
        
        # Analyze
        result = analyzer.analyze_civic_issue(
            image_data=input_data.get('imageData'),
            text=input_data.get('text'),
            audio_data=input_data.get('audioData'),
            location=input_data.get('location')
        )
        
        # Output result
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }, indent=2))

if __name__ == "__main__":
    main()
