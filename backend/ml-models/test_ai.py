#!/usr/bin/env python3
"""
Test script for the Enhanced Civic Analyzer
"""

import json
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_civic_analyzer import EnhancedCivicAnalyzer

def test_text_analysis():
    """Test text-only analysis"""
    print("🧪 Testing Text Analysis...")
    
    try:
        analyzer = EnhancedCivicAnalyzer()
        
        # Test cases
        test_cases = [
            "road has potholes and is broken",
            "street light is not working",
            "water leakage from pipe",
            "garbage not collected",
            "traffic signal broken"
        ]
        
        for text in test_cases:
            print(f"\n📝 Testing: '{text}'")
            result = analyzer.analyze_civic_issue(text=text)
            print(f"✅ Result: {json.dumps(result, indent=2)}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_image_analysis():
    """Test image analysis with a sample image"""
    print("\n🧪 Testing Image Analysis...")
    
    try:
        analyzer = EnhancedCivicAnalyzer()
        
        # Create a simple test image (1x1 pixel)
        from PIL import Image
        import base64
        import io
        
        # Create a simple test image
        test_image = Image.new('RGB', (100, 100), color='red')
        
        # Convert to base64
        buffer = io.BytesIO()
        test_image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        print(f"📸 Testing with sample image...")
        result = analyzer.analyze_civic_issue(image_data=img_str, text="test image")
        print(f"✅ Result: {json.dumps(result, indent=2)}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_problem_identification():
    """Test problem identification logic"""
    print("\n🧪 Testing Problem Identification...")
    
    try:
        analyzer = EnhancedCivicAnalyzer()
        
        test_cases = [
            ("a road with potholes", "road has holes"),
            ("broken street light", "light not working"),
            ("water leaking from pipe", "water problem"),
            ("garbage on street", "dirty area"),
            ("traffic signal not working", "signal broken")
        ]
        
        for caption, text in test_cases:
            problem = analyzer.identify_problem(caption, text)
            print(f"📝 Caption: '{caption}' | Text: '{text}'")
            print(f"🔍 Identified Problem: {problem}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Starting AI Model Tests...")
    
    test_text_analysis()
    test_problem_identification()
    test_image_analysis()
    
    print("\n✅ All tests completed!")
