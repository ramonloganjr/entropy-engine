"""
OCR Service - Extract lottery numbers from ticket images
Uses PIL for image processing (pytesseract optional)
"""
import re
from typing import Optional
from io import BytesIO
from PIL import Image

# Try to import pytesseract, fallback to demo mode if not available
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False


class OCRService:
    """
    Service for extracting lottery numbers from scanned tickets
    """
    
    def __init__(self):
        self.tesseract_available = TESSERACT_AVAILABLE
    
    def extract_numbers(self, image_bytes: bytes) -> dict:
        """
        Extract lottery numbers from an image
        
        Returns:
            dict with success, white_balls, powerball, raw_text
        """
        try:
            # Load image
            image = Image.open(BytesIO(image_bytes))
            
            if self.tesseract_available:
                return self._extract_with_tesseract(image)
            else:
                return self._demo_mode_extract(image)
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "raw_text": ""
            }
    
    def _extract_with_tesseract(self, image: Image.Image) -> dict:
        """Extract using Tesseract OCR"""
        # Preprocess image for better OCR
        image = image.convert('L')  # Grayscale
        
        # Run OCR
        raw_text = pytesseract.image_to_string(image)
        
        # Parse numbers from text
        return self._parse_lottery_numbers(raw_text)
    
    def _demo_mode_extract(self, image: Image.Image) -> dict:
        """
        Demo mode when Tesseract is not available
        Returns a simulated extraction for testing purposes
        """
        import random
        
        # Generate random "extracted" numbers for demo
        white_balls = sorted(random.sample(range(1, 70), 5))
        powerball = random.randint(1, 26)
        
        return {
            "success": True,
            "white_balls": white_balls,
            "powerball": powerball,
            "raw_text": f"[DEMO MODE] Simulated: {white_balls} PB: {powerball}",
            "demo_mode": True
        }
    
    def _parse_lottery_numbers(self, raw_text: str) -> dict:
        """
        Parse lottery numbers from OCR text
        Looks for patterns like:
        - "05 12 23 45 67  PB: 15"
        - "5-12-23-45-67 Powerball: 15"
        """
        # Find all numbers in the text
        all_numbers = re.findall(r'\b(\d{1,2})\b', raw_text)
        
        if len(all_numbers) < 6:
            return {
                "success": False,
                "raw_text": raw_text,
                "error": "Could not find enough numbers in the image"
            }
        
        # Convert to integers
        numbers = [int(n) for n in all_numbers]
        
        # Filter for valid Powerball ranges
        white_candidates = [n for n in numbers if 1 <= n <= 69]
        pb_candidates = [n for n in numbers if 1 <= n <= 26]
        
        if len(white_candidates) < 5:
            return {
                "success": False,
                "raw_text": raw_text,
                "error": "Could not identify 5 white ball numbers"
            }
        
        # Take first 5 unique white balls and last valid as Powerball
        white_balls = []
        for n in white_candidates:
            if n not in white_balls and len(white_balls) < 5:
                white_balls.append(n)
        
        # Powerball is typically last number or marked separately
        powerball = pb_candidates[-1] if pb_candidates else 1
        
        return {
            "success": True,
            "white_balls": sorted(white_balls),
            "powerball": powerball,
            "raw_text": raw_text
        }
