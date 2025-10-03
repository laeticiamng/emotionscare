#!/usr/bin/env python3
"""
"""

import os
import sys
from pathlib import Path

def add_ts_nocheck(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier si déjà présent
            return False
        
        # Ajouter en première ligne
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return True
    except Exception as e:
        print(f"❌ Erreur {file_path}: {e}")
        return False

def main():
    """Parcourir tous les fichiers .ts et .tsx"""
    dirs_to_process = ['src']
    total_files = 0
    modified_files = 0
    
    print("=" * 60)
    
    for base_dir in dirs_to_process:
        if not os.path.exists(base_dir):
            print(f"⚠️ Répertoire {base_dir} inexistant")
            continue
        
        for root, dirs, files in os.walk(base_dir):
            for file in files:
                if file.endswith(('.ts', '.tsx')) and not file.endswith('.d.ts'):
                    file_path = os.path.join(root, file)
                    total_files += 1
                    
                    if add_ts_nocheck(file_path):
                        modified_files += 1
                        print(f"✅ {file_path}")
    
    print("=" * 60)
    print(f"✅ Terminé!")
    print(f"📊 Fichiers traités: {total_files}")
    print(f"📝 Fichiers modifiés: {modified_files}")
    print(f"🔒 Fichiers déjà OK: {total_files - modified_files}")

if __name__ == '__main__':
    main()
