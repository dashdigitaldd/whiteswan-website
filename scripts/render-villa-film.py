"""Render the homepage film from approved photographs, without a runtime dependency.
Requires ffmpeg with libx264. Run with the website virtualenv; outputs are committed.
"""
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = shutil.which('ffmpeg') or '/opt/homebrew/bin/ffmpeg'
FPS, SECONDS, OVERLAP = 24, 5, .8
SOURCES = [
    '/assets/editorial/villa-light-1536.webp',
    '/assets/enhanced/listing-1685140810-1086.webp',
    '/assets/enhanced/listing-2569998613-1536.webp',
    '/assets/enhanced/listing-2580025730-1536.webp',
    '/assets/enhanced/guide-transfer-1536.webp',
]
KITCHEN = '/assets/enhanced/listing-1852228438-1536.webp'

def run(args):
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-filter_complex_threads', '2', *args], check=True)

def camera(w, h, index):
    # Oversampled stills avoid subpixel crawl during the very small camera move.
    zoom = '1.035+0.035*on/119' if index % 2 == 0 else '1.07-0.035*on/119'
    return (f'scale={w*2}:{h*2}:force_original_aspect_ratio=increase,'
            f'crop={w*2}:{h*2},zoompan=z=\'{zoom}\':x=\'iw/2-iw/zoom/2\':'
            f'y=\'ih/2-ih/zoom/2\':d=120:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p')

def render(label, w, h, crf, work):
    clips=[]
    for i, source in enumerate(SOURCES):
        out=work/f'{label}-{i}.mp4'
        args=['-i', str(ROOT/source.lstrip('/'))]
        if i == 2:
            args += ['-i', str(ROOT/KITCHEN.lstrip('/'))]
            if label == 'desktop':
                left = int(w*.64)//2*2
                filt=(f'[0:v]{camera(left-4,h,i)}[a];[1:v]{camera(w-left-4,h,i+1)}[b];'
                      f'[a]pad={left+4}:{h}:0:0:color=0x0E1B2C[pad];[pad][b]hstack=inputs=2[v]')
            else:
                top = int(h*.63)//2*2
                filt=(f'[0:v]{camera(w,top-4,i)}[a];[1:v]{camera(w,h-top-4,i+1)}[b];'
                      f'[a]pad={w}:{top+4}:0:0:color=0x0E1B2C[pad];[pad][b]vstack=inputs=2[v]')
            args += ['-filter_complex', filt, '-map', '[v]']
        else:
            args += ['-vf', camera(w,h,i)]
        run(args+['-frames:v','120','-an','-c:v','libx264','-preset','fast','-crf','19','-threads','2',str(out)])
        clips.append(out)
    args=[]
    for p in clips:args += ['-i',str(p)]
    graph=[]
    for i in range(5):graph.append(f'[{i}:v]settb=AVTB,setpts=PTS-STARTPTS[v{i}]')
    transitions=['smoothleft','fade','smoothright','fade']
    prev='v0'
    for i,transition in enumerate(transitions,1):
        output=f'x{i}'
        graph.append(f'[{prev}][v{i}]xfade=transition={transition}:duration={OVERLAP}:offset={i*(SECONDS-OVERLAP):.2f}[{output}]')
        prev=output
    dest=ROOT/'assets/film'/f'white-swan-{label}.mp4'
    run(args+['-filter_complex',';'.join(graph),'-map',f'[{prev}]','-an','-c:v','libx264','-preset','slow','-crf',str(crf),'-maxrate','2200k' if label=='desktop' else '950k','-bufsize','4400k' if label=='desktop' else '1900k','-pix_fmt','yuv420p','-movflags','+faststart','-threads','2',str(dest)])
    print(f'{label}: {dest.stat().st_size/1024/1024:.2f} MiB',flush=True)
    return {'url':'/'+str(dest.relative_to(ROOT)), 'width':w, 'height':h, 'bytes':dest.stat().st_size}

if __name__=='__main__':
    with tempfile.TemporaryDirectory(prefix='white-swan-film-') as tmp:
        variants={name:render(name,w,h,crf,Path(tmp)) for name,w,h,crf in [('desktop',1440,810,24),('mobile',640,800,25)]}
    manifest={'title':'White Swan, from day to night','duration_seconds':21.8,'fps':FPS,'audio':False,
              'technique':'A motion composition of approved property photographs. No simulated people, amenities or live-action footage.',
              'sources':SOURCES+[KITCHEN],'variants':variants,
              'chapters':[{'start':round(i*4.2+.4 if i else 0,2),'key':key} for i,key in enumerate(['villa','pool','table','bedroom','night'])]}
    (ROOT/'content/villa-film.json').write_text(json.dumps(manifest,indent=2)+'\n')
