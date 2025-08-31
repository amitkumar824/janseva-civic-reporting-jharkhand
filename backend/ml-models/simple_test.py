#!/usr/bin/env python3
"""
Simple test for the AI model command line interface
"""

import json
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_civic_analyzer import EnhancedCivicAnalyzer

def test_command_line_interface():
    """Test the command line interface"""
    print("🧪 Testing Command Line Interface...")
    
    # Test cases
    test_inputs = [
        {
            "imageData": None,
            "text": "road has potholes and is broken",
            "audioData": None,
            "location": "Jamshedpur"
        },
        {
            "imageData": None,
            "text": "street light is not working",
            "audioData": None,
            "location": "Ranchi"
        }
    ]
    
    for i, test_input in enumerate(test_inputs):
        print(f"\n📝 Test {i+1}: {test_input['text']}")
        
        # Simulate command line call
        try:
            analyzer = EnhancedCivicAnalyzer()
            result = analyzer.analyze_civic_issue(
                image_data=test_input['imageData'],
                text=test_input['text'],
                audio_data=test_input['audioData'],
                location=test_input['location']
            )
            
            print(f"✅ Success: {result['success']}")
            if result['success']:
                data = result['data']
                print(f"🔍 Problem: {data['problemIdentified']}")
                print(f"🏢 Department: {data['department']}")
                print(f"📊 Category: {data['category']}")
                print(f"⚡ Priority: {data['priority']}")
                print(f"📝 Title: {data['title']}")
            else:
                print(f"❌ Error: {result.get('error', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_command_line_interface()
