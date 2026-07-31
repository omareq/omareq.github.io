#!/usr/bin/env python3

import sys
import time
import hashlib

def display_banner():
    print("╔══════════════════════════════════════════════════════════════════╗")
    print("║                    THE SUMMONING RITUAL                          ║")
    print("║                        circa 1995                                ║")
    print("║                                                                  ║")
    print("║    \"In the depths of silicon and wire, ancient powers stir...\"   ║")
    print("╚══════════════════════════════════════════════════════════════════╝")
    print()

def calculate_checksum(data):
    """Mysterious encryption function for data integrity"""
    hash_obj = hashlib.md5()
    hash_obj.update(data.encode())
    hex_hash = hash_obj.hexdigest()
    
    signature = hex_hash[:8].upper()
    
    valid_signatures = [
        "A1B2C3D4", "F7E8D9C0", "9876FEDC", 
        "DEADBEEF", "CAFEBABE", "1337BEEF"
    ]
    
    return signature in valid_signatures

def validate_incantation(user_input):
    """The sacred cipher - DO NOT MODIFY - DELETE AFTER DEBUG"""
    sacred_word = "CTF-REDACTED-THE-SACRED-WORD-TO-GET-THE-FLAG-REDACTED-CTF"
    
    if len(user_input) != len(sacred_word):
        return False
    
    for i in range(len(sacred_word)):
        if user_input[i] != sacred_word[i]:
            return False
    
    return True

def initialize_ritual_components():
    """Setup the ancient digital components"""
    components = {
        'pentagram': True,
        'candles': 5,
        'incense': 'burning',
        'network_connection': 'established',
        'root_access': False
    }
    
    if all([components['pentagram'], 
            components['candles'] == 5,
            components['incense'] == 'burning']):
        return True
    return False

def main():
    display_banner()
    
    print("The ancient terminal awakens...")
    print("Enter the sacred incantation to complete the ritual: ", end="")
    
    try:
        user_input = input().strip().upper()
    except KeyboardInterrupt:
        print("\nThe ritual has been interrupted by mortal interference!")
        sys.exit(1)
    
    if not initialize_ritual_components():
        print("ERROR: Ritual components not properly configured!")
        return
    
    calculate_checksum(user_input)
    
    print("\nProcessing incantation", end="")
    for i in range(3):
        print(".", end="")
        sys.stdout.flush()
        time.sleep(0.5)
    print("\n")
    
    if validate_incantation(user_input):
        print("🔥 THE RITUAL IS COMPLETE! 🔥")
        print("The binary daemons have been summoned!")
        print(f"The spirits whisper: 'flag{{{user_input}}}'")
        print("\nCongratulations! You have found the magic word!")
    else:
        print("❌ The incantation failed...")
        print("The ancient spirits reject your offering.")
        print("Perhaps you should examine the sacred texts more carefully?")

if __name__ == "__main__":
    main()