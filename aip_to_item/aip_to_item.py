import configparser
from lxml import etree
import os
import random
import shutil
import subprocess

config = configparser.ConfigParser()
config.read('config.ini')

# creating a working copy
os.mkdir('working_copy')
for root, _, files in os.walk(config['aip_storage']['path']):
    for name in files:
        command = [
            os.path.join('unar1.8.1_win', 'unar.exe'),
            '-force-overwrite', 
            '-output-directory', 'working_copy',
            os.path.join(root, name)
        ]
        subprocess.check_call(command)

# premis in mets in archivematica
for name in os.listdir('working_copy'):
    aip_uuid = '-'.join(name.split('-')[-5:])
    tree = etree.parse(os.path.join('working_copy', name, 'data', 'METS.' + aip_uuid + ".xml"))
    
    act = random.choice(tree.xpath('//premis:act', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    restriction = random.choice(tree.xpath('//premis:restriction', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    rights_granted_note = random.choice(tree.xpath('//premis:rightsGrantedNote', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    
    item_group = 'Anonymous'
    bitstream_group = 'Anonymous'
    if act == 'disseminate' and restriction == 'Disallow':
        item_group = 'BentleyStaff'
        bitstream_group = 'BentleyStaff'
    elif act == 'disseminate' and restriction == 'Conditional':
        if 'Reading-Room Only' in rights_granted_note:
            bitstream_group = 'Bentley Only Users'
        elif 'Streaming Only' in rights_granted_note:
            bitstream_group = 'BentleyStaff'
        elif 'UM Only' in rights_granted_note:
            bitstream_group = 'UM Users'  
    
    # aip repackaging
    os.mkdir(os.path.join('working_copy', name, 'objects'))
    for item in os.listdir(os.path.join('working_copy', name, 'data', 'objects')):
        if item in ['metadata', 'submissionDocumentation']:
            continue
        os.rename(os.path.join('working_copy', name, 'data', 'objects', item), os.path.join('working_copy', name, 'objects', item))
    os.chdir(os.path.join('working_copy', name))
    command = [
        os.path.join('..', '..', '7-Zip', '7z.exe'), 'a',
        '-bd',
        '-tzip',
        '-y',
        '-mtc=on',
        '-mmt=on',
        os.path.join('objects.zip'),
        os.path.join('objects')
    ]
    subprocess.check_call(command)
    os.chdir(os.path.join('..', '..'))
    shutil.rmtree(os.path.join('working_copy', name, 'objects'))
    
    os.chdir('working_copy')
    command = [
        os.path.join('..', '7-Zip', '7z.exe'), 'a',
        '-bd',
        '-tzip',
        '-y',
        '-mtc=on',
        '-mmt=on',
        '-x!' + os.path.join(name, 'objects.zip'),
        os.path.join(name, 'metadata.zip'),
        name
    ]
    subprocess.check_call(command)
    os.chdir(os.path.join('..'))
    for item in os.listdir(os.path.join('working_copy', name)):
        if item in ['objects.zip', 'metadata.zip']:
            continue
        elif item == 'data':
            shutil.rmtree(os.path.join('working_copy', name, item))
        elif item in ['bag-info.txt', 'bagit.txt', 'manifest-sha256.txt', 'tagmanifest-md5.txt']:
            os.remove(os.path.join('working_copy', name, item))
        
    # rest api - dspace 5.x documentation
    
    # update archivesspace digital object

# clean up, clean up, everbody do your part
'''
shutil.rmtree('working_copy')
for root, dirs, _ in os.walk(config['aip_storage']['path']):
    for dir in dirs:
        shutil.rmtree(os.path.join(root, dir))'''
