import configparser
from dappr import DAPPr
from config import prod
from datetime import datetime
from lxml import etree
import os
import random
import requests
from selenium import webdriver
import shutil
import subprocess

config = configparser.ConfigParser()
config.read('config.ini')

# TODO logging

# creating a working copy
os.mkdir('working_copy')
for root, _, files in os.walk(config['aip_storage']['path']):
    for name in files:
        command = [
            'unar',
            '-force-overwrite', 
            '-output-directory', 'working_copy',
            os.path.join(root, name)
        ]
        subprocess.check_call(command)
        
bentleystaff_items = []

# premis in mets in archivematica
for name in os.listdir('working_copy'):
    aip_uuid = '-'.join(name.split('-')[-5:])
    tree = etree.parse(os.path.join('working_copy', name, 'data', 'METS.' + aip_uuid + '.xml'))
    
    act = random.choice(tree.xpath('//premis:act', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    restriction = random.choice(tree.xpath('//premis:restriction', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    rights_granted_note = random.choice(tree.xpath('//premis:rightsGrantedNote', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text
    end_date = random.choice(tree.xpath('//premis:endDate', namespaces={'premis': 'info:lc/xmlns/premis-v2'})).text

    item_group = 'Anonymous'
    bitstream_group = 'Anonymous'

    if act == 'disseminate' and restriction == 'Disallow':
        item_group = 'BentleyStaff'
        bitstream_group = 'BentleyStaff'
    elif act == 'disseminate' and restriction == 'Conditional':
        if 'Reading-Room Only' in rights_granted_note:
            bitstream_group = 'Bentley Only Users'
        # TODO add mivideo ID if necessary--make digital object unpublished
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
        '7z', 'a',
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
        '7z', 'a',
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
    
    # get archivesspace archival object descriptive metadata
    print "\n"
    print '***'
    # TODO parse the archival object url
    archival_object_id = input('Enter the ArchivesSpace Archival Object ID for ' + name + ': ')
    print '***' 

    url = config['archivesspace']['base_url'] + '/users/' + config['archivesspace']['user'] + '/login?password=' + config['archivesspace']['password']
    response = requests.post(url)
    token = response.json().get('session')
 
    url = config['archivesspace']['base_url'] + '/repositories/' + config['archivesspace']['repository'] + '/archival_objects/' + str(archival_object_id)
    headers = {'X-ArchivesSpace-Session': token}
    response = requests.get(url, headers=headers)
    archival_object = response.json()
    
    title = archival_object.get('display_string', '')
    
    description_abstract = ''
    rights_access = ''
    for note in archival_object['notes']:
        if note['type'] == 'odd':
            description_abstract = note['subnotes'][0]['content']
        elif note['type'] == 'accessrestrict':
            rights_access = note['subnotes'][0]['content']
    
    contributor_author = ''
    url = config['archivesspace']['base_url'] + archival_object['resource']['ref']
    response = requests.get(url, headers=headers)
    resource = response.json()
    for linked_agent in resource['linked_agents'] :
        if linked_agent['role'] == 'creator':
            url = config['archivesspace']['base_url'] + linked_agent['ref']
            response = requests.get(url, headers=headers)
            creator = response.json()
            contributor_author = creator['title']
    
    date_issued = str(datetime.now().year)
    
    rights_copyright = 'This content may be under copyright. Researchers are responsible for determining the appropriate use or reuse of materials. Please consult the collection finding aid or catalog record for more information.'
    
    relation_ispartofseries = []
    while archival_object.get('parent'):
        url = config['archivesspace']['base_url'] + archival_object['parent']['ref']
        response = requests.get(url, headers=headers)
        parent_archival_object = response.json()
        relation_ispartofseries.append(parent_archival_object['display_string'])
        archival_object = parent_archival_object
    relation_ispartofseries.reverse()
    relation_ispartofseries = ' - '.join(relation_ispartofseries)
 
    # post item and bitstreams to dspace
    deepblue = DAPPr(
        prod.get('base_url'),
        prod.get('email'),
        prod.get('password'), 
    )
   
    print '\n'
    print '***'
    # TODO get the collection id from the handle
    collection_id = input('Enter the DSpace Collection ID: ')
    print '***'
    
    item = {
        'name': title
    }
    item = deepblue.post_collection_item(int(collection_id), item)
    item_id = item['id']
    item_handle = item['handle']
    
    metadata = [
        {'key': 'dc.title', 'value': title},
        {'key': 'dc.description.abstract', 'value': description_abstract},
        {'key': 'dc.rights.access', 'value': rights_access},
        {'key': 'dc.contributor.author', 'value': contributor_author},
        {'key': 'dc.date.issued', 'value': date_issued},
        {'key': 'dc.rights.copyright', 'value': rights_copyright},
        {'key': 'dc.relation.ispartofseries', 'value': relation_ispartofseries},
    ]
    if item_group == 'BentleyStaff':
        metadata.extend([
            {'key': 'dc.date.open', 'value': end_date},
            {'key': 'dc.description.restriction', 'value': 'RESTRICTED'},
        ])
    deepblue.put_item_metadata(int(item_id), metadata)
    
    for bitstream in os.listdir(os.path.join('working_copy', name)):
        if bitstream.startswith('objects'):
            bitstream = deepblue.post_item_bitstream(int(item_id), os.path.join('working_copy', name, bitstream))
            bitstream_id = bitstream['id']
            
            bitstream['name'] = 'objects.zip'
            if bitstream_group == 'Bentley Only Users':
                bitstream['description'] = 'Archival materials. Access restricted to Bentley Reading Room.'
            elif bitstream_group == 'UM Users':
                bitstream['description'] = 'Archival materials. Access restricted to UM Users.'
            elif bitstream_group == 'BentleyStaff':
                bitstream['description'] = 'Archival materials. Access restricted to Bentley staff.'
            deepblue.put_bitstream(int(bitstream_id), bitstream)
            
            if bitstream_group == 'Bentley Only Users':
                deepblue.put_bitstream_policy(int(bitstream_id), [{"action": "READ", "rpType": "TYPE_CUSTOM", "groupId": 474}])
            elif bitstream_group == 'UM Users':
                deepblue.put_bitstream_policy(int(bitstream_id), [{"action": "READ", "rpType": "TYPE_CUSTOM", "groupId": 20}])
            elif bitstream_group == 'BentleyStaff':
                deepblue.put_bitstream_policy(int(bitstream_id), [{"action": "READ", "rpType": "TYPE_CUSTOM", "groupId": 560}])
            
        elif bitstream.startswith('metadata'):
            bitstream = deepblue.post_item_bitstream(int(item_id), os.path.join('working_copy', name, bitstream))
            
            bitstream_id = bitstream['id']
            
            bitstream['name'] = 'metadata.zip'
            bitstream['description'] = 'Administrative information. Access restricted to Bentley staff.'
            deepblue.put_bitstream(int(bitstream_id), bitstream)
            
            deepblue.put_bitstream_policy(int(bitstream_id), [{"action": "READ", "rpType": "TYPE_CUSTOM", "groupId": config['dspace']['metadata_group_id']}])
            
    deepblue.post_item_license(int(item_id))

    if item_group == 'BentleyStaff':
        bentleystaff_items.append(item_handle)
        # email jose
        # TODO figure this out--Edit Collection --> Assign Roles --> Edit authorization policies directly

    # update archivesspace digital object
    url = config['archivesspace']['base_url'] + '/repositories/' + config['archivesspace']['repository'] + '/archival_objects/' + str(archival_object_id)
    response = requests.get(url, headers=headers)
    archival_object = response.json()
    
    for instance in archival_object['instances']:
        url = config['archivesspace']['base_url'] + instance['digital_object']['ref']
        response = requests.get(url, headers=headers)
        digital_object = response.json()
        if digital_object['created_by'] == 'archivematica':
            digital_object['publish'] = False
            digital_object['file_versions'] = [
                {
                    'file_uri': 'http://hdl.handle.net/' + item_handle,
                    'xlink_show_attribute': 'new',
                    'xlink_actuate_attribute': 'onRequest'
                }
            ]
            
            response = requests.post(url, headers=headers, json=digital_object)
    
    # TODO logout of archivesspace
    
    # TODO slack notification

# clean up, clean up, everbody do your part
shutil.rmtree('working_copy')
'''
for root, dirs, _ in os.walk(config['aip_storage']['path']):
    for dir in dirs:
        shutil.rmtree(os.path.join(root, dir))'''
