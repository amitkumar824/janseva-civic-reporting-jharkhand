#!/usr/bin/env python3
"""
Quick test for road/pothole detection
"""

from enhanced_civic_analyzer import EnhancedCivicAnalyzer

def test_road_detection():
    print("🧪 Testing Road/Pothole Detection...")
    
    analyzer = EnhancedCivicAnalyzer()
    
    test_cases = [
        "road has potholes and is broken",
        "potholes on the road",
        "road damage",
        "broken road"
    ]
    
    for text in test_cases:
        print(f"\n📝 Testing: '{text}'")
        result = analyzer.analyze_civic_issue(text=text)
        problem = result['data']['problemIdentified']
        print(f"🔍 Problem: {problem}")
        print(f"🏢 Department: {result['data']['department']}")
        print(f"📊 Category: {result['data']['category']}")

if __name__ == "__main__":
    test_road_detection()
